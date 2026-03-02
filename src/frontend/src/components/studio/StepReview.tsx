import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Download,
  Edit2,
  Save,
  Share2,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiWhatsapp, SiX } from "react-icons/si";
import { toast } from "sonner";
import type {
  AnimeProject,
  AnimeStyle,
  Duration,
  StudioState,
} from "../../types/anime";

const STYLE_LABELS: Record<string, string> = {
  shonen: "Shonen Action ⚔️",
  ninja: "Ninja 🥷",
  "dark-fantasy": "Dark Fantasy 🌑",
  romance: "Romance 🌸",
  cyberpunk: "Cyberpunk 🤖",
};

const GENERATION_MESSAGES = [
  "Analyzing story...",
  "Generating keyframes...",
  "Applying anime style...",
  "Adding character details...",
  "Building scene effects...",
  "Rendering audio...",
  "Adding transitions...",
  "Finalizing video...",
  "Almost ready...",
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateName(state: StudioState): string {
  const styleLabel = STYLE_LABELS[state.style] ?? state.style;
  const keywords = state.prompt
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w.replace(/[^a-zA-Z]/g, ""))
    .filter(Boolean)
    .join(" ");
  const base = `${styleLabel.split(" ")[0]} - ${keywords || "Anime"}`;
  return base;
}

interface SummaryRowProps {
  label: string;
  value: string;
  onEdit: () => void;
}

function SummaryRow({ label, value, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border/30 last:border-0">
      <div className="flex-1">
        <p className="text-muted-foreground text-xs font-rajdhani uppercase tracking-wider">
          {label}
        </p>
        <p className="text-foreground text-sm font-exo mt-0.5">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="p-1 text-muted-foreground hover:text-primary transition-colors ml-3 shrink-0"
        aria-label={`Edit ${label}`}
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function GenerationProgress({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);
  const completeCalledRef = useRef(false);

  useEffect(() => {
    const duration = 4200; // ms
    const interval = 80;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const pct = Math.min((current / steps) * 100, 100);
      setProgress(pct);
      setMessageIdx(Math.floor((pct / 100) * (GENERATION_MESSAGES.length - 1)));

      if (pct >= 100) {
        clearInterval(timer);
        if (!completeCalledRef.current) {
          completeCalledRef.current = true;
          setTimeout(onComplete, 300);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-fade-in">
      {/* Animated orb with rings */}
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div
          className="ring-spin absolute inset-0 rounded-full"
          style={{
            border: "2px solid oklch(0.65 0.25 290 / 0.5)",
            borderTopColor: "oklch(0.65 0.25 290)",
          }}
        />
        {/* Middle ring */}
        <div
          className="ring-spin-reverse absolute inset-3 rounded-full"
          style={{
            border: "2px solid oklch(0.78 0.20 198 / 0.4)",
            borderBottomColor: "oklch(0.78 0.20 198)",
          }}
        />
        {/* Inner ring */}
        <div
          className="ring-spin absolute inset-6 rounded-full"
          style={{
            border: "1px solid oklch(0.72 0.22 278 / 0.6)",
            borderTopColor: "oklch(0.72 0.22 278)",
            animationDuration: "3s",
          }}
        />
        {/* Core orb */}
        <div
          className="orb-pulse absolute inset-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.20 198 / 0.9), oklch(0.65 0.25 290 / 0.6))",
            boxShadow:
              "0 0 20px oklch(0.78 0.20 198 / 0.6), 0 0 40px oklch(0.65 0.25 290 / 0.3)",
          }}
        />
      </div>

      <div className="text-center space-y-2">
        <p className="font-orbitron text-sm font-bold gradient-text">
          Generating Your Anime
        </p>
        <p className="text-muted-foreground text-sm font-exo">
          {GENERATION_MESSAGES[messageIdx]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <Progress
          value={progress}
          className="h-2"
          style={{ background: "oklch(0.20 0.03 245)" }}
        />
        <div className="flex justify-between text-xs text-muted-foreground font-exo">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-exo text-center max-w-xs">
        This would connect to AI rendering servers in production. Your video
        preview will appear shortly.
      </p>
    </div>
  );
}

function GenerationComplete({
  project,
  onSave,
}: {
  project: AnimeProject;
  onSave: (p: AnimeProject) => void;
}) {
  const styleColors: Record<string, string> = {
    shonen: "oklch(0.78 0.20 198)",
    ninja: "oklch(0.60 0.15 150)",
    "dark-fantasy": "oklch(0.55 0.18 290)",
    romance: "oklch(0.72 0.20 0)",
    cyberpunk: "oklch(0.78 0.22 198)",
  };
  const accentColor = styleColors[project.style] ?? "oklch(0.78 0.20 198)";

  const handleDownload = useCallback(() => {
    const content = `FreeAnime AI Studio — Project Export\n\nTitle: ${project.name}\nStyle: ${STYLE_LABELS[project.style] ?? project.style}\nDuration: ${project.duration}\nQuality: ${project.quality}\n\nStory:\n${project.prompt}\n\nCharacter:\n- Hair: ${project.character.hairStyle} / ${project.character.hairColor}\n- Eyes: ${project.character.eyeGlow}\n- Aura: ${project.character.aura}\n- Outfit: ${project.character.outfit}\n\nScene:\n- Background: ${project.scene.background}\n- Weather: ${project.scene.weather}\n- Time: ${project.scene.timeOfDay}\n\nAudio:\n- Voiceover: ${project.audio.voiceover ? `Yes (${project.audio.voiceGender})` : "No"}\n- Music: ${project.audio.music}\n- SFX: ${project.audio.sfx.join(", ") || "None"}\n\nGenerated via FreeAnime AI Studio — caffeine.ai`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, "_")}_${project.quality}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Project file downloaded!");
  }, [project]);

  const handleShareX = useCallback(() => {
    const text = `Just created an anime video with FreeAnime AI Studio! "${project.name}" — ${STYLE_LABELS[project.style] ?? project.style} style. 100% free, no watermarks! #AnimeAI #FreeAnime`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Share text copied! Paste it on X (Twitter)");
      })
      .catch(() => {
        toast.error("Could not copy to clipboard");
      });
  }, [project]);

  const handleShareWhatsApp = useCallback(() => {
    const text = `Check out my anime video: "${project.name}" created with FreeAnime AI Studio — 100% free! 🎬✨`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Share text copied! Paste it on WhatsApp");
      })
      .catch(() => {
        toast.error("Could not copy to clipboard");
      });
  }, [project]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Header */}
      <div className="text-center py-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}50`,
            boxShadow: `0 0 20px ${accentColor}25`,
          }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: accentColor }} />
        </div>
        <h3 className="font-orbitron text-xl font-bold gradient-text mb-1">
          Generation Complete!
        </h3>
        <p className="text-muted-foreground text-sm font-exo">
          Your anime video is ready
        </p>
      </div>

      {/* Video Preview Placeholder */}
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}20 0%, oklch(0.10 0.025 245) 70%)`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        {/* Decorative frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-5xl">
              {project.style === "shonen"
                ? "⚔️"
                : project.style === "ninja"
                  ? "🥷"
                  : project.style === "dark-fantasy"
                    ? "🌑"
                    : project.style === "romance"
                      ? "🌸"
                      : "🤖"}
            </div>
            <div>
              <p
                className="font-orbitron text-sm font-semibold"
                style={{ color: accentColor }}
              >
                {project.name}
              </p>
              <p className="text-muted-foreground text-xs font-exo mt-1">
                {project.duration} • {project.quality} •{" "}
                {STYLE_LABELS[project.style] ?? project.style}
              </p>
            </div>
          </div>
        </div>
        {/* Corner decorations */}
        <div
          className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl"
          style={{ borderColor: accentColor }}
        />
        <div
          className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr"
          style={{ borderColor: accentColor }}
        />
        <div
          className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl"
          style={{ borderColor: accentColor }}
        />
        <div
          className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br"
          style={{ borderColor: accentColor }}
        />
        {/* Badge */}
        <div className="absolute top-3 right-3 mr-6">
          <span
            className="text-xs font-rajdhani font-semibold px-2 py-0.5 rounded"
            style={{
              background: "oklch(0.55 0.18 145 / 0.25)",
              color: "oklch(0.72 0.16 145)",
              border: "1px solid oklch(0.55 0.18 145 / 0.4)",
            }}
          >
            🎬 Preview
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="gap-2 font-rajdhani font-semibold border-border/60 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Download {project.quality}
        </Button>
        <Button
          onClick={() => onSave(project)}
          className="gap-2 font-rajdhani font-bold btn-gradient text-foreground border-0 shadow-glow-purple hover:shadow-glow-both transition-all duration-300"
        >
          <Save className="w-4 h-4" />
          Save to Library
        </Button>
      </div>

      {/* Share Buttons */}
      <div>
        <p className="text-xs font-rajdhani uppercase tracking-wider text-muted-foreground mb-3">
          Share Your Creation
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleShareX}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-rajdhani font-semibold border transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "oklch(0.14 0.03 245)",
              border: "1px solid oklch(0.28 0.08 245)",
              color: "oklch(0.60 0.04 240)",
            }}
          >
            <SiX className="w-4 h-4" />
            Share on X
          </button>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-rajdhani font-semibold border transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "oklch(0.14 0.03 245)",
              border: "1px solid oklch(0.28 0.08 245)",
              color: "oklch(0.60 0.04 240)",
            }}
          >
            <SiWhatsapp className="w-4 h-4" />
            Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                .writeText(
                  `Check out my anime: "${project.name}" — FreeAnime AI Studio!`,
                )
                .then(() => {
                  toast.success("Link copied to clipboard!");
                })
                .catch(() => {
                  toast.error("Could not copy");
                });
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-rajdhani font-semibold border transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "oklch(0.14 0.03 245)",
              border: "1px solid oklch(0.28 0.08 245)",
              color: "oklch(0.60 0.04 240)",
            }}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  state: StudioState;
  onChange: (partial: Partial<StudioState>) => void;
  initialProject: AnimeProject | null;
  onSave: (project: AnimeProject) => void;
  onEditStep: (step: number) => void;
}

type ReviewPhase = "review" | "generating" | "complete";

export default function StepReview({
  state,
  onChange,
  initialProject,
  onSave,
  onEditStep,
}: Props) {
  const [phase, setPhase] = useState<ReviewPhase>("review");
  const [generatedProject, setGeneratedProject] = useState<AnimeProject | null>(
    null,
  );

  // Auto-generate project name if empty
  const displayName = state.projectName || generateName(state);

  const handleStartGeneration = useCallback(() => {
    // Build the project object
    const project: AnimeProject = {
      id: initialProject?.id ?? generateId(),
      name: state.projectName || generateName(state),
      createdAt: initialProject?.createdAt ?? new Date().toISOString(),
      style: state.style as AnimeStyle,
      prompt: state.prompt,
      duration: state.duration as Duration,
      character: state.character,
      scene: state.scene,
      audio: state.audio,
      quality: state.quality,
      status: "generated",
    };
    setGeneratedProject(project);
    setPhase("generating");
  }, [state, initialProject]);

  const handleGenerationComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  if (phase === "generating") {
    return (
      <div className="animate-fade-in">
        <GenerationProgress onComplete={handleGenerationComplete} />
      </div>
    );
  }

  if (phase === "complete" && generatedProject) {
    return <GenerationComplete project={generatedProject} onSave={onSave} />;
  }

  // Review phase
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold mb-1">
          <span className="gradient-text">Review & Generate</span>
        </h2>
        <p className="text-muted-foreground text-sm font-exo">
          Confirm your settings before generating
        </p>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <Label
          htmlFor="project-name"
          className="text-sm font-rajdhani font-semibold uppercase tracking-wider text-foreground"
        >
          Project Name
        </Label>
        <Input
          id="project-name"
          value={state.projectName}
          onChange={(e) => onChange({ projectName: e.target.value })}
          placeholder={displayName}
          className="font-exo text-sm"
          style={{
            background: "oklch(0.14 0.03 245)",
            border: "1px solid oklch(0.28 0.08 245)",
          }}
        />
      </div>

      {/* Export Quality */}
      <div className="space-y-3">
        <p className="text-sm font-rajdhani font-semibold uppercase tracking-wider text-foreground">
          Export Quality
        </p>
        <div className="flex gap-3">
          {(["720p", "1080p"] as const).map((q) => {
            const selected = state.quality === q;
            return (
              <button
                key={q}
                type="button"
                onClick={() => onChange({ quality: q })}
                className="flex-1 py-3 rounded-xl font-orbitron font-bold text-sm border transition-all duration-200"
                style={
                  selected
                    ? {
                        background: "oklch(0.65 0.25 290 / 0.15)",
                        border: "1px solid oklch(0.65 0.25 290 / 0.8)",
                        color: "oklch(0.65 0.25 290)",
                        boxShadow: "0 0 12px oklch(0.65 0.25 290 / 0.25)",
                      }
                    : {
                        background: "oklch(0.14 0.03 245)",
                        border: "1px solid oklch(0.28 0.08 245)",
                        color: "oklch(0.60 0.04 240)",
                      }
                }
              >
                {q}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "oklch(0.14 0.03 245)",
          border: "1px solid oklch(0.28 0.08 245)",
        }}
      >
        <div className="px-4 py-3 border-b border-border/30">
          <p className="font-orbitron text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Summary
          </p>
        </div>
        <div className="px-4 py-1 divide-y divide-border/20">
          <SummaryRow
            label="Story"
            value={
              state.prompt.length > 80
                ? `${state.prompt.slice(0, 80)}...`
                : state.prompt
            }
            onEdit={() => onEditStep(1)}
          />
          <SummaryRow
            label="Style & Duration"
            value={`${STYLE_LABELS[state.style] ?? state.style} • ${state.duration}`}
            onEdit={() => onEditStep(1)}
          />
          <SummaryRow
            label="Character"
            value={`${state.character.hairStyle} ${state.character.hairColor} hair • ${state.character.eyeGlow} eyes • ${state.character.aura !== "None" ? `${state.character.aura} aura • ` : ""}${state.character.outfit}`}
            onEdit={() => onEditStep(2)}
          />
          <SummaryRow
            label="Scene"
            value={`${state.scene.background} • ${state.scene.weather} • ${state.scene.timeOfDay === "day" ? "☀️ Day" : "🌙 Night"}`}
            onEdit={() => onEditStep(3)}
          />
          <SummaryRow
            label="Audio"
            value={`${state.audio.voiceover ? `${state.audio.voiceGender} voice • ` : "No voice • "}${state.audio.music}${state.audio.sfx.length > 0 ? ` • ${state.audio.sfx.length} SFX` : ""}`}
            onEdit={() => onEditStep(4)}
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="pb-4">
        <button
          type="button"
          onClick={handleStartGeneration}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-xl font-orbitron font-bold text-base text-foreground cursor-pointer transition-all duration-300 hover:scale-[1.01] animate-pulse-glow"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.25 290), oklch(0.72 0.22 278), oklch(0.78 0.20 198))",
            border: "1px solid oklch(0.78 0.20 198 / 0.3)",
          }}
        >
          <Sparkles className="w-5 h-5" />
          Generate Anime Video
          <span className="text-xl">🎬</span>
        </button>
        <p className="text-center text-xs text-muted-foreground font-exo mt-3">
          100% Free • No watermarks • No hidden charges
        </p>
      </div>
    </div>
  );
}
