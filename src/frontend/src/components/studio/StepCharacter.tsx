import type { CharacterConfig, StudioState } from "../../types/anime";

const HAIR_STYLES = ["Spiky", "Long", "Short", "Flowing", "Bald"];
const HAIR_COLORS = [
  { name: "Black", hex: "#1a1a2e" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Blonde", hex: "#FFD700" },
  { name: "Red", hex: "#CC2200" },
  { name: "Blue", hex: "#0088FF" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Silver", hex: "#C0C0C0" },
  {
    name: "Rainbow",
    hex: "linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)",
  },
];
const EYE_GLOWS = [
  { name: "None", color: "oklch(0.60 0.04 240)" },
  { name: "Blue Glow", color: "oklch(0.72 0.20 240)" },
  { name: "Red Glow", color: "oklch(0.62 0.22 25)" },
  { name: "Purple Glow", color: "oklch(0.65 0.25 290)" },
  { name: "Golden Glow", color: "oklch(0.80 0.18 70)" },
  { name: "White Glow", color: "oklch(0.95 0.01 240)" },
];
const AURA_POWERS = [
  { name: "None", emoji: "" },
  { name: "Fire", emoji: "🔥" },
  { name: "Lightning", emoji: "⚡" },
  { name: "Shadow", emoji: "🌑" },
  { name: "Energy", emoji: "💫" },
  { name: "Ice", emoji: "❄️" },
];
const OUTFITS = [
  "School Uniform",
  "Ninja Suit",
  "Armor",
  "Casual",
  "Futuristic",
  "Traditional",
];

interface Props {
  state: StudioState;
  onChange: (partial: Partial<StudioState>) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-rajdhani font-semibold uppercase tracking-wider mb-3 gradient-text">
      {children}
    </p>
  );
}

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-sm font-rajdhani font-medium border transition-all duration-200 hover:scale-105"
      style={
        selected
          ? {
              background: "oklch(0.78 0.20 198 / 0.15)",
              border: "1px solid oklch(0.78 0.20 198 / 0.8)",
              color: "oklch(0.78 0.20 198)",
              boxShadow: "0 0 8px oklch(0.78 0.20 198 / 0.3)",
            }
          : {
              background: "oklch(0.14 0.03 245)",
              border: "1px solid oklch(0.28 0.08 245)",
              color: "oklch(0.60 0.04 240)",
            }
      }
    >
      {children}
    </button>
  );
}

function updateCharacter(
  char: CharacterConfig,
  field: keyof CharacterConfig,
  value: string,
): CharacterConfig {
  return { ...char, [field]: value };
}

export default function StepCharacter({ state, onChange }: Props) {
  const char = state.character;

  const setChar = (field: keyof CharacterConfig, value: string) => {
    onChange({ character: updateCharacter(char, field, value) });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold mb-1">
          <span className="gradient-text">Character Design</span>
        </h2>
        <p className="text-muted-foreground text-sm font-exo">
          Customize your anime protagonist's appearance
        </p>
      </div>

      {/* Hair Style */}
      <div>
        <SectionTitle>Hair Style</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {HAIR_STYLES.map((hs) => (
            <PillButton
              key={hs}
              selected={char.hairStyle === hs}
              onClick={() => setChar("hairStyle", hs)}
            >
              {hs}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <SectionTitle>Hair Color</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {HAIR_COLORS.map((hc) => {
            const selected = char.hairColor === hc.name;
            return (
              <button
                key={hc.name}
                type="button"
                onClick={() => setChar("hairColor", hc.name)}
                title={hc.name}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-9 h-9 rounded-full border-2 transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: hc.hex,
                    borderColor: selected
                      ? "oklch(0.78 0.20 198)"
                      : "oklch(0.28 0.08 245)",
                    boxShadow: selected
                      ? "0 0 10px oklch(0.78 0.20 198 / 0.5)"
                      : "none",
                  }}
                />
                <span
                  className="text-xs font-exo transition-colors"
                  style={{
                    color: selected
                      ? "oklch(0.78 0.20 198)"
                      : "oklch(0.60 0.04 240)",
                  }}
                >
                  {hc.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Eye Glow */}
      <div>
        <SectionTitle>Eye Glow Effects</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {EYE_GLOWS.map((eg) => {
            const selected = char.eyeGlow === eg.name;
            return (
              <button
                key={eg.name}
                type="button"
                onClick={() => setChar("eyeGlow", eg.name)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-rajdhani font-medium border transition-all duration-200 hover:scale-105"
                style={
                  selected
                    ? {
                        background: `${eg.color}20`,
                        border: `1px solid ${eg.color}`,
                        color: eg.color,
                        boxShadow: `0 0 8px ${eg.color}40`,
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                        color: "oklch(0.60 0.04 240)",
                      }
                }
              >
                {eg.name !== "None" && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: eg.color,
                      boxShadow: selected ? `0 0 6px ${eg.color}` : "none",
                    }}
                  />
                )}
                {eg.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aura Powers */}
      <div>
        <SectionTitle>Aura Powers</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {AURA_POWERS.map((ap) => (
            <PillButton
              key={ap.name}
              selected={char.aura === ap.name}
              onClick={() => setChar("aura", ap.name)}
            >
              {ap.emoji ? `${ap.emoji} ` : ""}
              {ap.name}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div>
        <SectionTitle>Outfit</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OUTFITS.map((outfit) => {
            const selected = char.outfit === outfit;
            return (
              <button
                key={outfit}
                type="button"
                onClick={() => setChar("outfit", outfit)}
                className="p-3 rounded-lg text-sm font-rajdhani font-medium border text-center transition-all duration-200 hover:scale-[1.02]"
                style={
                  selected
                    ? {
                        background: "oklch(0.65 0.25 290 / 0.15)",
                        border: "1px solid oklch(0.65 0.25 290 / 0.8)",
                        color: "oklch(0.65 0.25 290)",
                        boxShadow: "0 0 10px oklch(0.65 0.25 290 / 0.25)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                        color: "oklch(0.60 0.04 240)",
                      }
                }
              >
                {outfit}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
