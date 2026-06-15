import { ScoringCard } from "./ScoringCard";
import { RulesList } from "./RulesList";
import { FormatExamples } from "./FormatExamples";
import { EntryFeeWarning } from "./EntryFeeWarning";

export function Rules() {
  return (
    <>
      <ScoringCard />
      <RulesList />
      <FormatExamples />
      <EntryFeeWarning />
    </>
  );
}
