import { Textarea } from "@/components/ui/textarea";
import type { AnimeStyle, Duration, StudioState } from "../../types/anime";

const DURATIONS: { value: Duration; label: string }[] = [
  { value: "10s", label: "10 sec" },
  { value: "30s", label: "30 sec" },
  { value: "1min", label: "1 min" },
  { value: "5min", label: "5 min" },
  { value: "10min", label: "10 min" },
  { value: "20min", label: "20 min" },
];

const STYLES: {
  value: AnimeStyle;
  label: string;
  emoji: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "shonen",
    label: "Shonen Action",
    emoji: "⚔️",
    desc: "Epic battles, power-ups, rivalries",
    color: "oklch(0.78 0.20 198)",
  },
  {
    value: "ninja",
    label: "Ninja",
    emoji: "🥷",
    desc: "Stealth, speed, shadow arts",
    color: "oklch(0.60 0.15 150)",
  },
  {
    value: "dark-fantasy",
    label: "Dark Fantasy",
    emoji: "🌑",
    desc: "Demons, cursed powers, dark magic",
    color: "oklch(0.55 0.18 290)",
  },
  {
    value: "romance",
    label: "Romance",
    emoji: "🌸",
    desc: "Love stories, emotional depth",
    color: "oklch(0.72 0.20 0)",
  },
  {
    value: "cyberpunk",
    label: "Cyberpunk",
    emoji: "🤖",
    desc: "Neon cities, tech, augmentation",
    color: "oklch(0.78 0.22 198)",
  },
];

interface Props {
  state: StudioState;
  onChange: (partial: Partial<StudioState>) => void;
  errors: Record<string, string>;
}

export default function StepStoryStyle({ state, onChange, errors }: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-foreground mb-1">
          <span className="gradient-text">Story & Style</span>
        </h2>
        <p className="text-muted-foreground text-sm font-exo">
          Describe your anime story and choose your visual style
        </p>
      </div>

      {/* Story Prompt */}
      <div className="space-y-3">
        <label
          htmlFor="story-prompt"
          className="block text-sm font-rajdhani font-semibold text-foreground uppercase tracking-wider"
        >
          Your Story Prompt
        </label>
        <Textarea
          id="story-prompt"
          value={state.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          placeholder="Describe your anime story... e.g. 'A young ninja discovers ancient powers in a neon-lit city. He must face a shadow organization threatening to destroy his village. Epic battles, betrayal, and the discovery of his true identity unfold...'"
          className="min-h-[140px] text-sm font-exo leading-relaxed resize-none transition-all duration-200 focus:shadow-glow-cyan"
          style={{
            background: "oklch(0.14 0.03 245)",
            border: errors.prompt
              ? "1px solid oklch(0.65 0.22 25)"
              : "1px solid oklch(0.28 0.08 245)",
            color: "oklch(0.96 0.015 240)",
          }}
        />
        {errors.prompt && (
          <p
            className="text-xs font-exo"
            style={{ color: "oklch(0.65 0.22 25)" }}
          >
            ⚠ {errors.prompt}
          </p>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <p className="block text-sm font-rajdhani font-semibold text-foreground uppercase tracking-wider">
          Video Duration
        </p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => {
            const selected = state.duration === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => onChange({ duration: d.value })}
                className="px-4 py-2 rounded-lg text-sm font-rajdhani font-semibold border transition-all duration-200 hover:scale-105"
                style={
                  selected
                    ? {
                        background: "oklch(0.78 0.20 198 / 0.15)",
                        border: "1px solid oklch(0.78 0.20 198 / 0.8)",
                        color: "oklch(0.78 0.20 198)",
                        boxShadow: "0 0 10px oklch(0.78 0.20 198 / 0.3)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                        color: "oklch(0.60 0.04 240)",
                      }
                }
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Anime Style */}
      <div className="space-y-3">
        <p className="text-sm font-rajdhani font-semibold text-foreground uppercase tracking-wider">
          Anime Style
          {errors.style && (
            <span
              className="ml-2 text-xs font-normal normal-case"
              style={{ color: "oklch(0.65 0.22 25)" }}
            >
              ⚠ {errors.style}
            </span>
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STYLES.map((s) => {
            const selected = state.style === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onChange({ style: s.value })}
                className="relative p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] group"
                style={
                  selected
                    ? {
                        background: `${s.color}18`,
                        border: `1px solid ${s.color}`,
                        boxShadow: `0 0 15px ${s.color}30`,
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                      }
                }
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">
                    {s.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-rajdhani font-semibold text-sm transition-colors duration-200"
                      style={{
                        color: selected ? s.color : "oklch(0.96 0.015 240)",
                      }}
                    >
                      {s.label}
                    </p>
                    <p className="text-muted-foreground text-xs font-exo mt-0.5 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                  {selected && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: s.color }}
                    >
                      <svg
                        aria-hidden="true"
                        className="w-2.5 h-2.5 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <title>Selected</title>
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
