import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SceneConfig, StudioState } from "../../types/anime";

const BACKGROUNDS = [
  { name: "City", emoji: "🌆", desc: "Urban neon skyline" },
  { name: "Forest", emoji: "🌳", desc: "Ancient mystical woods" },
  { name: "Space", emoji: "🌌", desc: "Starfields & nebulae" },
  { name: "Temple", emoji: "⛩️", desc: "Sacred ancient grounds" },
  { name: "Desert", emoji: "🏜️", desc: "Endless sand dunes" },
  { name: "Ocean", emoji: "🌊", desc: "Vast open waters" },
];

const WEATHER_OPTIONS = [
  { name: "Clear", emoji: "" },
  { name: "Rain", emoji: "🌧️" },
  { name: "Storm", emoji: "⛈️" },
  { name: "Sunset", emoji: "🌅" },
  { name: "Snow", emoji: "❄️" },
  { name: "Fog", emoji: "" },
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

function updateScene(
  scene: SceneConfig,
  field: keyof SceneConfig,
  value: string | "day" | "night",
): SceneConfig {
  return { ...scene, [field]: value };
}

export default function StepScene({ state, onChange }: Props) {
  const scene = state.scene;

  const setScene = (
    field: keyof SceneConfig,
    value: string | "day" | "night",
  ) => {
    onChange({ scene: updateScene(scene, field, value) });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold mb-1">
          <span className="gradient-text">Scene Builder</span>
        </h2>
        <p className="text-muted-foreground text-sm font-exo">
          Design the world where your anime unfolds
        </p>
      </div>

      {/* Background */}
      <div>
        <SectionTitle>Background</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BACKGROUNDS.map((bg) => {
            const selected = scene.background === bg.name;
            return (
              <button
                key={bg.name}
                type="button"
                onClick={() => setScene("background", bg.name)}
                className="p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] group"
                style={
                  selected
                    ? {
                        background: "oklch(0.78 0.20 198 / 0.12)",
                        border: "1px solid oklch(0.78 0.20 198 / 0.7)",
                        boxShadow: "0 0 15px oklch(0.78 0.20 198 / 0.2)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                      }
                }
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200 leading-none">
                  {bg.emoji}
                </div>
                <p
                  className="font-rajdhani font-semibold text-sm"
                  style={{
                    color: selected
                      ? "oklch(0.78 0.20 198)"
                      : "oklch(0.96 0.015 240)",
                  }}
                >
                  {bg.name}
                </p>
                <p className="text-muted-foreground text-xs font-exo mt-0.5">
                  {bg.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weather Effects */}
      <div>
        <SectionTitle>Weather Effects</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {WEATHER_OPTIONS.map((w) => {
            const selected = scene.weather === w.name;
            return (
              <button
                key={w.name}
                type="button"
                onClick={() => setScene("weather", w.name)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-rajdhani font-medium border transition-all duration-200 hover:scale-105"
                style={
                  selected
                    ? {
                        background: "oklch(0.65 0.25 290 / 0.15)",
                        border: "1px solid oklch(0.65 0.25 290 / 0.8)",
                        color: "oklch(0.65 0.25 290)",
                        boxShadow: "0 0 8px oklch(0.65 0.25 290 / 0.3)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                        color: "oklch(0.60 0.04 240)",
                      }
                }
              >
                {w.emoji && <span>{w.emoji}</span>}
                {w.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <SectionTitle>Time of Day</SectionTitle>
        <div
          className="flex items-center gap-4 p-4 rounded-xl border"
          style={{
            background: "oklch(0.14 0.03 245)",
            border: "1px solid oklch(0.28 0.08 245)",
          }}
        >
          <button
            type="button"
            onClick={() => setScene("timeOfDay", "day")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-rajdhani font-semibold text-sm transition-all duration-200"
            style={
              scene.timeOfDay === "day"
                ? {
                    background: "oklch(0.80 0.18 70 / 0.2)",
                    color: "oklch(0.80 0.18 70)",
                    border: "1px solid oklch(0.80 0.18 70 / 0.6)",
                    boxShadow: "0 0 10px oklch(0.80 0.18 70 / 0.3)",
                  }
                : {
                    background: "transparent",
                    color: "oklch(0.60 0.04 240)",
                    border: "1px solid transparent",
                  }
            }
          >
            ☀️ Day
          </button>

          <div className="flex-1 flex items-center gap-3">
            <Switch
              id="time-toggle"
              checked={scene.timeOfDay === "night"}
              onCheckedChange={(checked) =>
                setScene("timeOfDay", checked ? "night" : "day")
              }
            />
          </div>

          <button
            type="button"
            onClick={() => setScene("timeOfDay", "night")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-rajdhani font-semibold text-sm transition-all duration-200"
            style={
              scene.timeOfDay === "night"
                ? {
                    background: "oklch(0.65 0.25 290 / 0.2)",
                    color: "oklch(0.65 0.25 290)",
                    border: "1px solid oklch(0.65 0.25 290 / 0.6)",
                    boxShadow: "0 0 10px oklch(0.65 0.25 290 / 0.3)",
                  }
                : {
                    background: "transparent",
                    color: "oklch(0.60 0.04 240)",
                    border: "1px solid transparent",
                  }
            }
          >
            🌙 Night
          </button>
        </div>
        <Label htmlFor="time-toggle" className="sr-only">
          Toggle day/night
        </Label>
      </div>
    </div>
  );
}
