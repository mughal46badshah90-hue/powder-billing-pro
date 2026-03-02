import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AudioConfig, StudioState } from "../../types/anime";

const MUSIC_OPTIONS = [
  { name: "Epic Battle", emoji: "⚔️", desc: "Intense orchestral action" },
  { name: "Calm Melodic", emoji: "🎵", desc: "Peaceful background melody" },
  { name: "Dark Ambient", emoji: "🌑", desc: "Mysterious dark tones" },
  { name: "Romantic", emoji: "🌸", desc: "Emotional love theme" },
  { name: "Cyberpunk Beats", emoji: "🤖", desc: "Electronic synth vibes" },
  { name: "Silent", emoji: "🔇", desc: "No background music" },
];

const SFX_OPTIONS = [
  { name: "Sword Clashes", emoji: "⚔️" },
  { name: "Thunder", emoji: "⛈️" },
  { name: "Wind", emoji: "💨" },
  { name: "Footsteps", emoji: "👣" },
  { name: "Magic Sparkle", emoji: "✨" },
];

const VOICE_GENDERS: {
  value: "male" | "female" | "neutral";
  label: string;
  emoji: string;
}[] = [
  { value: "male", label: "Male", emoji: "♂️" },
  { value: "female", label: "Female", emoji: "♀️" },
  { value: "neutral", label: "Neutral", emoji: "◎" },
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

function updateAudio(
  audio: AudioConfig,
  partial: Partial<AudioConfig>,
): AudioConfig {
  return { ...audio, ...partial };
}

export default function StepAudio({ state, onChange }: Props) {
  const audio = state.audio;

  const setAudio = (partial: Partial<AudioConfig>) => {
    onChange({ audio: updateAudio(audio, partial) });
  };

  const toggleSfx = (sfxName: string) => {
    const current = audio.sfx;
    const updated = current.includes(sfxName)
      ? current.filter((s) => s !== sfxName)
      : [...current, sfxName];
    setAudio({ sfx: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold mb-1">
          <span className="gradient-text">Audio Design</span>
        </h2>
        <p className="text-muted-foreground text-sm font-exo">
          Configure voiceover, music, and sound effects
        </p>
      </div>

      {/* Voiceover */}
      <div>
        <SectionTitle>AI Voiceover</SectionTitle>
        <div
          className="p-4 rounded-xl border space-y-4"
          style={{
            background: "oklch(0.14 0.03 245)",
            border: "1px solid oklch(0.28 0.08 245)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-rajdhani font-semibold text-sm text-foreground">
                Enable AI Voiceover
              </p>
              <p className="text-muted-foreground text-xs font-exo mt-0.5">
                Auto-narrate your story with AI voice
              </p>
            </div>
            <Switch
              id="voiceover-toggle"
              checked={audio.voiceover}
              onCheckedChange={(checked) => setAudio({ voiceover: checked })}
            />
          </div>
          <Label htmlFor="voiceover-toggle" className="sr-only">
            Toggle AI voiceover
          </Label>

          {audio.voiceover && (
            <div className="pt-3 border-t border-border/40 animate-fade-in">
              <p className="text-xs font-rajdhani uppercase tracking-wider text-muted-foreground mb-3">
                Voice Gender
              </p>
              <div className="flex gap-2">
                {VOICE_GENDERS.map((vg) => {
                  const selected = audio.voiceGender === vg.value;
                  return (
                    <button
                      key={vg.value}
                      type="button"
                      onClick={() => setAudio({ voiceGender: vg.value })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-rajdhani font-semibold border transition-all duration-200"
                      style={
                        selected
                          ? {
                              background: "oklch(0.78 0.20 198 / 0.15)",
                              border: "1px solid oklch(0.78 0.20 198 / 0.8)",
                              color: "oklch(0.78 0.20 198)",
                            }
                          : {
                              background: "oklch(0.12 0.025 245)",
                              border: "1px solid oklch(0.28 0.08 245)",
                              color: "oklch(0.60 0.04 240)",
                            }
                      }
                    >
                      <span>{vg.emoji}</span>
                      {vg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Music */}
      <div>
        <SectionTitle>Background Music</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MUSIC_OPTIONS.map((m) => {
            const selected = audio.music === m.name;
            return (
              <button
                key={m.name}
                type="button"
                onClick={() => setAudio({ music: m.name })}
                className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]"
                style={
                  selected
                    ? {
                        background: "oklch(0.65 0.25 290 / 0.15)",
                        border: "1px solid oklch(0.65 0.25 290 / 0.8)",
                        boxShadow: "0 0 12px oklch(0.65 0.25 290 / 0.2)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                      }
                }
              >
                <span className="text-xl leading-none">{m.emoji}</span>
                <div>
                  <p
                    className="font-rajdhani font-semibold text-sm"
                    style={{
                      color: selected
                        ? "oklch(0.65 0.25 290)"
                        : "oklch(0.96 0.015 240)",
                    }}
                  >
                    {m.name}
                  </p>
                  <p className="text-muted-foreground text-xs font-exo">
                    {m.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound Effects */}
      <div>
        <SectionTitle>Sound Effects (select multiple)</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {SFX_OPTIONS.map((sfx) => {
            const selected = audio.sfx.includes(sfx.name);
            return (
              <button
                key={sfx.name}
                type="button"
                onClick={() => toggleSfx(sfx.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-rajdhani font-medium border transition-all duration-200 hover:scale-105"
                style={
                  selected
                    ? {
                        background: "oklch(0.72 0.22 278 / 0.15)",
                        border: "1px solid oklch(0.72 0.22 278 / 0.8)",
                        color: "oklch(0.72 0.22 278)",
                        boxShadow: "0 0 8px oklch(0.72 0.22 278 / 0.25)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                        color: "oklch(0.60 0.04 240)",
                      }
                }
              >
                {sfx.emoji} {sfx.name}
              </button>
            );
          })}
        </div>
        {audio.sfx.length > 0 && (
          <p className="text-xs text-muted-foreground font-exo mt-2">
            {audio.sfx.length} effect{audio.sfx.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    </div>
  );
}
