// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PoolEscrow
 * @notice Non-custodial prize pool for one tournament. Entrants pay a fixed
 *         entry fee in a stablecoin; the contract holds the pot until the
 *         operator settles. Anyone can read `totalPot()` and `entrantCount()`
 *         on-chain, so the pot and player count are publicly verifiable.
 *
 * @dev SECURITY / DESIGN NOTES — READ BEFORE MAINNET
 *  - Denominated in any 6-decimals stablecoin (USDC/EURC). Pass its address at
 *    deploy; to support a new host country, deploy with that country's stablecoin.
 *  - Uses OpenZeppelin SafeERC20 (handles non-standard ERC-20 return values),
 *    ReentrancyGuard, and Ownable. Follows checks-effects-interactions.
 *  - `rakeBps` (basis points, e.g. 1000 = 10%) is fixed at deploy and capped, so
 *    the operator cannot raise their cut after entries open.
 *  - This contract is UNAUDITED. Deploy to Base Sepolia (testnet) and get a
 *    professional audit before handling real funds. Paid contests are also
 *    regulated — handle eligibility/terms off-chain.
 */
contract PoolEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;     // stablecoin used for entry + payouts
    uint256 public immutable entryFee; // fee per entry, in token's smallest unit
    uint16 public immutable rakeBps;   // operator share in basis points (<= MAX_RAKE_BPS)
    uint16 public constant MAX_RAKE_BPS = 2000; // 20% hard cap

    uint256 public entrantCount;
    bool public settled;
    mapping(address => bool) public hasEntered;

    event Entered(address indexed player, uint256 amount);
    event Settled(uint256 prizePool, uint256 operatorTake);

    error AlreadyEntered();
    error EntriesClosed();
    error RakeTooHigh();

    constructor(
        address _token,
        uint256 _entryFee,
        uint16 _rakeBps,
        address _operator
    ) Ownable(_operator) {
        if (_rakeBps > MAX_RAKE_BPS) revert RakeTooHigh();
        token = IERC20(_token);
        entryFee = _entryFee;
        rakeBps = _rakeBps;
    }

    /// @notice Current pot held by the contract (in token units).
    function totalPot() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @notice Join the pool. The caller must first `approve` this contract to
     *         spend `entryFee` of the token. One entry per address.
     */
    function enter() external nonReentrant {
        if (settled) revert EntriesClosed();
        if (hasEntered[msg.sender]) revert AlreadyEntered();

        // effects before interaction
        hasEntered[msg.sender] = true;
        entrantCount += 1;

        // interaction (pull funds)
        token.safeTransferFrom(msg.sender, address(this), entryFee);
        emit Entered(msg.sender, entryFee);
    }

    /**
     * @notice Operator settles: pays winners and takes the rake. Called once.
     * @param winners  addresses to receive prizes
     * @param amounts  prize per winner (must sum to pot minus operator take)
     */
    function settle(address[] calldata winners, uint256[] calldata amounts)
        external
        onlyOwner
        nonReentrant
    {
        if (settled) revert EntriesClosed();
        require(winners.length == amounts.length, "length mismatch");
        settled = true;

        uint256 pot = token.balanceOf(address(this));
        uint256 operatorTake = (pot * rakeBps) / 10_000;

        for (uint256 i = 0; i < winners.length; i++) {
            token.safeTransfer(winners[i], amounts[i]);
        }
        if (operatorTake > 0) token.safeTransfer(owner(), operatorTake);

        emit Settled(pot - operatorTake, operatorTake);
    }
}
