import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Film, Heart, Play, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AnimeProject } from "../types/anime";

const STYLE_LABELS: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  shonen: { label: "Shonen Action", emoji: "⚔️", color: "oklch(0.78 0.20 198)" },
  ninja: { label: "Ninja", emoji: "🥷", color: "oklch(0.60 0.15 150)" },
  "dark-fantasy": {
    label: "Dark Fantasy",
    emoji: "🌑",
    color: "oklch(0.55 0.18 290)",
  },
  romance: { label: "Romance", emoji: "🌸", color: "oklch(0.72 0.20 0)" },
  cyberpunk: { label: "Cyberpunk", emoji: "🤖", color: "oklch(0.78 0.22 198)" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectCard({
  project,
  onContinue,
  onDelete,
}: {
  project: AnimeProject;
  onContinue: (p: AnimeProject) => void;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const styleInfo = STYLE_LABELS[project.style] ?? {
    label: project.style,
    emoji: "✨",
    color: "oklch(0.78 0.20 198)",
  };

  const handleDeleteClick = () => {
    if (confirming) {
      onDelete(project.id);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 2500);
    }
  };

  return (
    <article
      className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-glow-cyan animate-fade-in"
      style={{ animationDelay: "0.05s" }}
    >
      {/* Top color bar based on style */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${styleInfo.color}, transparent)`,
        }}
      />

      {/* Thumbnail placeholder */}
      <div
        className="relative h-32 flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, ${styleInfo.color}18 0%, oklch(0.10 0.025 245) 70%)`,
        }}
      >
        <div className="text-4xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300">
          {styleInfo.emoji}
        </div>
        {project.status === "generated" && (
          <div className="absolute top-2 right-2">
            <Badge
              className="text-xs px-2 py-0.5 font-exo"
              style={{
                background: "oklch(0.55 0.18 145 / 0.25)",
                border: "1px solid oklch(0.55 0.18 145 / 0.5)",
                color: "oklch(0.72 0.16 145)",
              }}
            >
              ✓ Generated
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs opacity-50">
          <Clock className="w-3 h-3" />
          <span className="font-exo">{project.duration}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-orbitron text-sm font-semibold text-foreground truncate mb-1 leading-tight">
          {project.name}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 font-exo leading-relaxed">
          {project.prompt}
        </p>

        <div className="flex items-center justify-between mb-3">
          <Badge
            className="text-xs px-2 py-0.5 font-rajdhani font-medium"
            style={{
              background: `${styleInfo.color}18`,
              border: `1px solid ${styleInfo.color}40`,
              color: styleInfo.color,
            }}
          >
            {styleInfo.emoji} {styleInfo.label}
          </Badge>
          <span className="text-muted-foreground text-xs font-exo">
            {formatDate(project.createdAt)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onContinue(project)}
            className="flex-1 h-8 text-xs font-rajdhani font-semibold gap-1.5 btn-gradient text-foreground border-0"
          >
            <Play className="w-3 h-3" />
            Continue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className={`h-8 w-8 p-0 border-border/60 transition-all duration-200 ${
              confirming
                ? "border-destructive/70 bg-destructive/10 text-destructive"
                : "text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      {/* Decorative anime illustration placeholder */}
      <div className="relative w-32 h-32 mb-6">
        <div
          className="absolute inset-0 rounded-full opacity-20 animate-ping"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.25 290), transparent)",
          }}
        />
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.14 0.03 245)",
            border: "1px solid oklch(0.65 0.25 290 / 0.3)",
          }}
        >
          <div className="relative">
            <Film className="w-12 h-12 text-muted-foreground opacity-50" />
            <Sparkles
              className="absolute -top-1 -right-1 w-4 h-4"
              style={{ color: "oklch(0.65 0.25 290 / 0.7)" }}
            />
          </div>
        </div>
      </div>
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-2">
        No projects yet
      </h3>
      <p className="text-muted-foreground text-sm font-exo max-w-xs mb-6 leading-relaxed">
        Your anime creations will appear here. Start your first project to bring
        your story to life.
      </p>
      <Button
        onClick={onCreateNew}
        className="gap-2 font-rajdhani font-bold text-base px-6 py-2.5 btn-gradient text-foreground border-0"
      >
        <Plus className="w-4 h-4" />
        Create Your First Anime
      </Button>
    </div>
  );
}

interface DashboardProps {
  projects: AnimeProject[];
  onCreateNew: () => void;
  onContinue: (project: AnimeProject) => void;
  onDelete: (id: string) => void;
}

export default function Dashboard({
  projects,
  onCreateNew,
  onContinue,
  onDelete,
}: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="relative border-b border-border/40 backdrop-blur-sm"
        style={{ background: "oklch(0.10 0.025 245 / 0.85)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{
                background: "oklch(0.14 0.03 245)",
                border: "1px solid oklch(0.65 0.25 290 / 0.4)",
                boxShadow: "0 0 12px oklch(0.65 0.25 290 / 0.2)",
              }}
            >
              ⚡
            </div>
            <div>
              <h1 className="font-orbitron text-base sm:text-lg font-bold leading-tight gradient-text">
                FreeAnime AI Studio
              </h1>
              <p className="text-muted-foreground text-xs font-exo hidden sm:block">
                100% Free • No Watermarks • No Limits
              </p>
            </div>
          </div>
          <Button
            onClick={onCreateNew}
            className="gap-2 font-rajdhani font-bold text-sm px-4 py-2 btn-gradient text-foreground border-0 shadow-glow-purple hover:shadow-glow-both transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Anime</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="text-center py-10 sm:py-14 mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-rajdhani font-semibold mb-6"
            style={{
              background: "oklch(0.65 0.25 290 / 0.1)",
              border: "1px solid oklch(0.65 0.25 290 / 0.3)",
              color: "oklch(0.65 0.25 290)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Anime Video Generation
          </div>

          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
            <span className="gradient-text">Create Anime</span>
            <br />
            <span className="text-foreground text-glow-cyan">
              from Your Imagination
            </span>
          </h2>
          <p className="text-muted-foreground font-exo text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Type your story, choose your style, and watch AI bring your anime
            vision to life — completely free, no watermarks.
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onCreateNew}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-orbitron font-bold text-base sm:text-lg text-foreground cursor-pointer transition-all duration-300 hover:scale-105 animate-pulse-glow"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.25 290), oklch(0.72 0.22 278), oklch(0.78 0.20 198))",
              border: "1px solid oklch(0.78 0.20 198 / 0.3)",
            }}
          >
            <span className="text-2xl">🎬</span>
            Create New Anime
            <span className="text-2xl">✨</span>
            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.98 0 0 / 0.08) 0%, transparent 50%)",
              }}
            />
          </button>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: "🆓", text: "Always Free" },
              { icon: "🚫", text: "No Watermarks" },
              { icon: "⚡", text: "5 Anime Styles" },
              { icon: "🎵", text: "AI Voiceover" },
              { icon: "📱", text: "Mobile Ready" },
            ].map((f) => (
              <span
                key={f.text}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-exo text-muted-foreground"
                style={{
                  background: "oklch(0.14 0.03 245)",
                  border: "1px solid oklch(0.28 0.08 245)",
                }}
              >
                <span>{f.icon}</span>
                {f.text}
              </span>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        {projects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-lg font-bold text-foreground">
                Your Projects
                <span className="ml-2 text-sm font-normal text-muted-foreground font-exo">
                  ({projects.length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onContinue={onContinue}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projects.length === 0 && <EmptyState onCreateNew={onCreateNew} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 text-center">
        <p className="text-muted-foreground text-xs font-exo">
          © 2026. Built with{" "}
          <Heart
            className="inline w-3 h-3 mx-0.5"
            style={{ color: "oklch(0.65 0.25 290)" }}
            fill="oklch(0.65 0.25 290)"
          />{" "}
          using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
