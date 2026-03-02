import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCallback, useState } from "react";
import type { AnimeProject, StudioState } from "../types/anime";
import { DEFAULT_STUDIO_STATE } from "../types/anime";

import StepAudio from "./studio/StepAudio";
import StepCharacter from "./studio/StepCharacter";
import StepReview from "./studio/StepReview";
import StepScene from "./studio/StepScene";
import StepStoryStyle from "./studio/StepStoryStyle";

const STEPS = [
  { id: 1, name: "Story & Style", short: "Story" },
  { id: 2, name: "Character", short: "Char" },
  { id: 3, name: "Scene", short: "Scene" },
  { id: 4, name: "Audio", short: "Audio" },
  { id: 5, name: "Generate", short: "Gen" },
];

function projectToState(project: AnimeProject): StudioState {
  return {
    prompt: project.prompt,
    duration: project.duration,
    style: project.style,
    character: project.character,
    scene: project.scene,
    audio: project.audio,
    quality: project.quality,
    projectName: project.name,
  };
}

interface StudioProps {
  initialProject: AnimeProject | null;
  onSave: (project: AnimeProject) => void;
  onBack: () => void;
}

export default function Studio({
  initialProject,
  onSave,
  onBack,
}: StudioProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [state, setState] = useState<StudioState>(
    initialProject ? projectToState(initialProject) : DEFAULT_STUDIO_STATE,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateState = useCallback(
    (partial: Partial<StudioState>) => {
      setState((prev) => ({ ...prev, ...partial }));
      // Clear errors for updated fields
      const clearedErrors: Record<string, string> = { ...errors };
      for (const k of Object.keys(partial)) {
        delete clearedErrors[k];
      }
      setErrors(clearedErrors);
    },
    [errors],
  );

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!state.prompt.trim()) {
        newErrors.prompt = "Please describe your anime story";
      }
      if (!state.style) {
        newErrors.style = "Please select an anime style";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, state.prompt, state.style]);

  const goNext = useCallback(() => {
    if (!validateStep()) return;
    setDirection("forward");
    setStep((s) => Math.min(s + 1, 5));
  }, [validateStep]);

  const goBack = useCallback(() => {
    if (step === 1) {
      onBack();
      return;
    }
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
  }, [step, onBack]);

  const handleSave = useCallback(
    (project: AnimeProject) => {
      onSave(project);
    },
    [onSave],
  );

  const animClass =
    direction === "forward"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b border-border/40 backdrop-blur-sm"
        style={{ background: "oklch(0.10 0.025 245 / 0.9)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground gap-1.5 -ml-2 font-rajdhani"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Dashboard" : "Back"}
            </Button>
            <div className="flex-1 text-center">
              <h1 className="font-orbitron text-sm sm:text-base font-bold gradient-text">
                FreeAnime AI Studio
              </h1>
            </div>
            <div className="w-20 text-right">
              <span className="text-muted-foreground text-xs font-exo">
                Step {step} of {STEPS.length}
              </span>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, idx) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-1 flex-1 min-w-0"
                >
                  <div className="flex flex-col items-center gap-1 flex-1">
                    {/* Step node */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold transition-all duration-300 shrink-0"
                      style={
                        isCompleted
                          ? {
                              background: "oklch(0.78 0.20 198 / 0.2)",
                              border: "1px solid oklch(0.78 0.20 198)",
                              color: "oklch(0.78 0.20 198)",
                            }
                          : isCurrent
                            ? {
                                background: "oklch(0.65 0.25 290 / 0.2)",
                                border: "1px solid oklch(0.65 0.25 290)",
                                color: "oklch(0.65 0.25 290)",
                                boxShadow:
                                  "0 0 10px oklch(0.65 0.25 290 / 0.4)",
                              }
                            : {
                                background: "oklch(0.14 0.03 245)",
                                border: "1px solid oklch(0.28 0.08 245)",
                                color: "oklch(0.60 0.04 240)",
                              }
                      }
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : s.id}
                    </div>
                    <span
                      className={`text-xs font-exo hidden sm:block transition-colors duration-300 ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {s.short}
                    </span>
                  </div>
                  {/* Connector */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className="h-px flex-1 transition-all duration-500 mb-4 sm:mb-0"
                      style={{
                        background: isCompleted
                          ? "oklch(0.78 0.20 198 / 0.5)"
                          : "oklch(0.28 0.08 245)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Step Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <div key={step} className={animClass}>
          {step === 1 && (
            <StepStoryStyle
              state={state}
              onChange={updateState}
              errors={errors}
            />
          )}
          {step === 2 && <StepCharacter state={state} onChange={updateState} />}
          {step === 3 && <StepScene state={state} onChange={updateState} />}
          {step === 4 && <StepAudio state={state} onChange={updateState} />}
          {step === 5 && (
            <StepReview
              state={state}
              onChange={updateState}
              initialProject={initialProject}
              onSave={handleSave}
              onEditStep={(s) => {
                setDirection("back");
                setStep(s);
              }}
            />
          )}
        </div>
      </main>

      {/* Navigation Footer (not shown on step 5 which handles its own buttons) */}
      {step < 5 && (
        <footer
          className="sticky bottom-0 border-t border-border/40 backdrop-blur-sm"
          style={{ background: "oklch(0.10 0.025 245 / 0.9)" }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goBack}
              className="gap-2 font-rajdhani font-semibold border-border/60 hover:border-border text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            <div className="flex items-center gap-2">
              {STEPS.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background:
                      step >= s.id
                        ? "oklch(0.65 0.25 290)"
                        : "oklch(0.28 0.08 245)",
                    boxShadow:
                      step === s.id
                        ? "0 0 6px oklch(0.65 0.25 290 / 0.6)"
                        : "none",
                  }}
                />
              ))}
            </div>

            <Button
              onClick={goNext}
              className="gap-2 font-rajdhani font-bold btn-gradient text-foreground border-0 shadow-glow-purple hover:shadow-glow-both transition-all duration-300"
            >
              {step === 4 ? "Review" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
