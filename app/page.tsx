"use client";

import { useState } from "react";

type Player = { name: string; paid: boolean; pts: number[] };

const INITIAL_PLAYERS: Player[] = [
  { name: "Zach",  paid: false, pts: [0, 0, 0] },
  { name: "Abdul", paid: false, pts: [0, 0, 0] },
];

const ROUNDS = ["Round 1", "Round 2", "Round 3"];

const SCORING = [
  { label: "Correct result",                          pts: 1, icon: "✓"  },
  { label: "Correct exact score",                     pts: 3, icon: "⚽" },
  { label: "Post-kickoff exact (0-0 at HT)",          pts: 1, icon: "⏱" },
];

const RULES = [
  "Predictions only after lineups are announced",
  "Must be sent before kickoff for full points",
  "Predictions sent by text in group chat",
  "Lineups sent in GC 1 hour before kickoff",
  'Format: "BRAvMAR: 2-2" or "MEXvRSA: 3-1 Mexico"',
  "Limit GC chat once prediction time begins",
  "Entry fee due before end of GW1 or you are disqualified",
  "Knockout Round on ESPN app to follow Group Stage",
];

const total = (p: Player) => p.pts.reduce((a, b) => a + b, 0);

function Rank({ rank }: { rank: number }) {
  const icons = ["🥇", "🥈", "🥉"];
  if (rank < 3) return <span style={{ fontSize: 22 }}>{icons[rank]}</span>;
  return (
    <span style={{
      width: 30, height: 30, borderRadius: "50%", background: "#1E3050",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, color: "#8899AA", fontWeight: 700,
    }}>{rank + 1}</span>
  );
}

function EditModal({ player, onSave, onDelete, onClose }: {
  player: Player; onSave: (p: Player) => void; onDelete: () => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState<Player>(JSON.parse(JSON.stringify(player)));
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, backdropFilter: "blur(6px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#131F35", borderRadius: 16, padding: 28,
        width: "min(420px,92vw)", border: "1px solid #1E3050",
        animation: "fadeUp 0.2s ease",
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Edit — {player.name}</h3>
        <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 6 }}>Name</label>
        <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          background: "#0A1628", border: "1px solid #1E3050", color: "#F5F5F0",
          fontSize: 14, marginBottom: 20, outline: "none",
        }} />
        <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 10 }}>Points per round</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {ROUNDS.map((r, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: "#8899AA", marginBottom: 4 }}>{r}</div>
              <input type="number" min={0} value={draft.pts[i]}
                onChange={e => {
                  const pts = [...draft.pts];
                  pts[i] = Math.max(0, parseInt(e.target.value) || 0);
                  setDraft({ ...draft, pts });
                }}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  background: "#0A1628", border: "1px solid #1E3050", color: "#E8C96B",
                  fontSize: 16, fontWeight: 700, outline: "none", textAlign: "center",
                }}
              />
            </div>
          ))}
        </div>
        <label onClick={() => setDraft({ ...draft, paid: !draft.paid })} style={{
          display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 24,
        }}>
          <div style={{
            width: 44, height: 24, borderRadius: 99,
            background: draft.paid ? "#1A6B3C" : "#1E3050",
            position: "relative", transition: "background 0.2s", flexShrink: 0,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#F5F5F0",
              position: "absolute", top: 3, left: draft.paid ? 23 : 3, transition: "left 0.2s",
            }} />
          </div>
          <span style={{ fontSize: 14, color: draft.paid ? "#4ade80" : "#8899AA" }}>
            {draft.paid ? "Entry fee paid ✓" : "Entry fee unpaid"}
          </span>
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onSave(draft)} style={{
            flex: 1, padding: "11px 0", borderRadius: 8, fontWeight: 700,
            background: "linear-gradient(135deg,#C9A84C,#E8C96B)", color: "#0A1628",
            border: "none", cursor: "pointer", fontSize: 14,
          }}>Save</button>
          <button onClick={onDelete} style={{
            padding: "11px 16px", borderRadius: 8, fontWeight: 600,
            background: "rgba(239,68,68,0.15)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontSize: 14,
          }}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [tab, setTab] = useState<"board" | "rules">("board");

  const sorted = [...players].map((p, i) => ({ ...p, _i: i })).sort((a, b) => total(b) - total(a));
  const pot = players.filter(p => p.paid).length * 25;

  return (
    <main style={{ minHeight: "100vh", background: "#0A1628" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(180deg,#0F2040 0%,#0A1628 100%)",
        borderBottom: "1px solid #1E3050", padding: "48px 20px 36px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)",
          pointerEvents: "none",
        }} />
        <div style={{
          display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
          color: "#C9A84C", background: "rgba(201,168,76,0.1)",
          padding: "4px 14px", borderRadius: 99, border: "1px solid rgba(201,168,76,0.25)",
          marginBottom: 16,
        }}>⚽ FIFA WORLD CUP 2026</div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(42px,10vw,88px)", lineHeight: 1, letterSpacing: "0.02em",
          background: "linear-gradient(135deg,#C9A84C,#E8C96B,#C9A84C)",
          backgroundSize: "200% auto", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: "shimmer 3s linear infinite", marginBottom: 8,
        }}>Group Stage<br />Pick-Em</h1>

        <p style={{ color: "#8899AA", fontSize: 14, marginBottom: pot > 0 ? 20 : 0 }}>
          Group Stage · $25 Entry · Glory Eternal
        </p>

        {pot > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: 10, padding: "10px 20px",
          }}>
            <span style={{ fontSize: 12, color: "#8899AA" }}>Current Pot</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#E8C96B" }}>${pot}</span>
            <span style={{ fontSize: 11, color: "#8899AA" }}>· Round ${Math.round(pot * 0.2)} · Total ${Math.round(pot * 0.4)}</span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", background: "#0F2040", borderBottom: "1px solid #1E3050",
        padding: "0 20px", maxWidth: 760, margin: "0 auto",
      }}>
        {(["board", "rules"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "14px 20px", fontWeight: 600, fontSize: 13,
            background: "none", border: "none", cursor: "pointer",
            color: tab === t ? "#E8C96B" : "#8899AA",
            borderBottom: tab === t ? "2px solid #C9A84C" : "2px solid transparent",
            textTransform: "uppercase", letterSpacing: "0.08em", transition: "color 0.15s",
          }}>
            {t === "board" ? "🏆 Leaderboard" : "📋 Rules"}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* LEADERBOARD */}
        {tab === "board" && (
          <>
            <div style={{
              display: "grid", gridTemplateColumns: "40px 1fr repeat(4, 56px)",
              gap: "0 12px", padding: "0 20px 8px",
              color: "#8899AA", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              <div /><div>Player</div>
              {ROUNDS.map((_, i) => <div key={i} style={{ textAlign: "center" }}>R{i + 1}</div>)}
              <div style={{ textAlign: "center" }}>Total</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sorted.map((p, rank) => (
                <div key={p._i} onClick={() => setEditing(p._i)} style={{
                  display: "grid", gridTemplateColumns: "40px 1fr repeat(4, 56px)",
                  alignItems: "center", gap: "0 12px", padding: "14px 20px",
                  background: rank === 0 ? "linear-gradient(90deg,rgba(201,168,76,0.10),transparent)" : "#131F35",
                  borderRadius: 10,
                  border: `1px solid ${rank === 0 ? "rgba(201,168,76,0.35)" : "#1E3050"}`,
                  cursor: "pointer", transition: "transform 0.15s",
                  animation: `fadeUp 0.4s ease ${rank * 0.08}s both`,
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateX(3px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "none")}
                >
                  <Rank rank={rank} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</span>
                    {p.paid
                      ? <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(26,107,60,0.35)", color: "#4ade80", fontWeight: 600 }}>PAID</span>
                      : <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(239,68,68,0.2)", color: "#f87171", fontWeight: 600 }}>UNPAID</span>
                    }
                  </div>
                  {p.pts.map((pt, i) => (
                    <span key={i} style={{ textAlign: "center", color: pt > 0 ? "#E8C96B" : "#8899AA", fontWeight: 600, fontSize: 14 }}>{pt}</span>
                  ))}
                  <span style={{ textAlign: "center", fontWeight: 700, fontSize: 16, color: rank === 0 ? "#E8C96B" : "#F5F5F0" }}>{total(p)}</span>
                </div>
              ))}
            </div>

            {adding ? (
              <div style={{
                marginTop: 12, display: "flex", gap: 8, alignItems: "center",
                background: "#131F35", border: "1px solid #1E3050", borderRadius: 10, padding: "12px 16px",
              }}>
                <input autoFocus placeholder="Player name…" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newName.trim()) {
                      setPlayers(prev => [...prev, { name: newName.trim(), paid: false, pts: [0, 0, 0] }]);
                      setNewName(""); setAdding(false);
                    }
                    if (e.key === "Escape") { setAdding(false); setNewName(""); }
                  }}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 7,
                    background: "#0A1628", border: "1px solid #1E3050",
                    color: "#F5F5F0", fontSize: 14, outline: "none",
                  }}
                />
                <button onClick={() => {
                  if (newName.trim()) {
                    setPlayers(prev => [...prev, { name: newName.trim(), paid: false, pts: [0, 0, 0] }]);
                    setNewName(""); setAdding(false);
                  }
                }} style={{
                  padding: "8px 16px", borderRadius: 7, fontWeight: 700,
                  background: "linear-gradient(135deg,#C9A84C,#E8C96B)",
                  color: "#0A1628", border: "none", cursor: "pointer", fontSize: 13,
                }}>Add</button>
                <button onClick={() => { setAdding(false); setNewName(""); }} style={{
                  padding: "8px 12px", borderRadius: 7, background: "none",
                  border: "1px solid #1E3050", color: "#8899AA", cursor: "pointer", fontSize: 13,
                }}>✕</button>
              </div>
            ) : (
              <button onClick={() => setAdding(true)} style={{
                marginTop: 12, width: "100%", padding: "12px",
                border: "1px dashed #1E3050", borderRadius: 10,
                background: "none", color: "#8899AA", cursor: "pointer",
                fontSize: 13, fontWeight: 600, transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E3050"; e.currentTarget.style.color = "#8899AA"; }}
              >+ Add Player</button>
            )}

            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { pct: "20%", label: "Each Round Winner", color: "#C9A84C" },
                { pct: "40%", label: "Overall Champion",  color: "#E8C96B" },
                { pct: "$25", label: "Entry Fee",         color: "#8899AA" },
              ].map((pr, i) => (
                <div key={i} style={{
                  background: "#131F35", border: "1px solid #1E3050",
                  borderRadius: 12, padding: "16px 12px", textAlign: "center",
                  animation: `fadeUp 0.4s ease ${i * 0.1 + 0.2}s both`,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: pr.color, marginBottom: 4 }}>{pr.pct}</div>
                  <div style={{ fontSize: 11, color: "#8899AA", fontWeight: 600 }}>{pr.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* RULES */}
        {tab === "rules" && (
          <>
            <div style={{
              background: "#131F35", border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 14, padding: 20, marginBottom: 16, animation: "fadeUp 0.3s ease",
            }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#C9A84C", marginBottom: 16, textTransform: "uppercase" }}>
                Scoring System
              </h2>
              {SCORING.map((s, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < SCORING.length - 1 ? "1px solid #1E3050" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, color: "#F5F5F0" }}>{s.label}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 20, color: "#E8C96B" }}>+{s.pts}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: "#131F35", border: "1px solid #1E3050",
              borderRadius: 14, padding: 20, animation: "fadeUp 0.3s ease 0.1s both",
            }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#C9A84C", marginBottom: 16, textTransform: "uppercase" }}>
                Rules
              </h2>
              {RULES.map((r, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, padding: "10px 0", alignItems: "flex-start",
                  borderBottom: i < RULES.length - 1 ? "1px solid #1E3050" : "none",
                }}>
                  <span style={{
                    minWidth: 22, height: 22, borderRadius: "50%",
                    background: "rgba(201,168,76,0.12)", color: "#C9A84C",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, marginTop: 1, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.6, color: "#C8D4E0" }}>{r}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, background: "#0F2040", border: "1px solid #1E3050",
              borderRadius: 12, padding: 16, animation: "fadeUp 0.3s ease 0.2s both",
            }}>
              <div style={{ fontSize: 11, color: "#8899AA", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 10 }}>
                PREDICTION FORMAT EXAMPLES
              </div>
              {['"BRAvMAR: 2-2"', '"MEXvRSA: 3-1 Mexico"'].map((ex, i) => (
                <div key={i} style={{
                  fontFamily: "monospace", fontSize: 14, color: "#E8C96B",
                  background: "#0A1628", padding: "8px 12px", borderRadius: 7,
                  marginBottom: i === 0 ? 8 : 0,
                }}>{ex}</div>
              ))}
            </div>

            <div style={{
              marginTop: 16, background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16,
              animation: "fadeUp 0.3s ease 0.25s both",
            }}>
              <div style={{ fontSize: 13, color: "#f87171", fontWeight: 600, marginBottom: 4 }}>
                ⚠️ Entry fee must be sent before end of GW1 or you are disqualified
              </div>
              <div style={{ fontSize: 12, color: "#8899AA" }}>Accepted: Cash App · Zelle · Apple Pay</div>
            </div>
          </>
        )}
      </div>

      {editing !== null && (
        <EditModal
          player={players[editing]}
          onSave={updated => {
            setPlayers(prev => prev.map((p, i) => i === editing ? updated : p));
            setEditing(null);
          }}
          onDelete={() => {
            setPlayers(prev => prev.filter((_, i) => i !== editing));
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </main>
  );
}
