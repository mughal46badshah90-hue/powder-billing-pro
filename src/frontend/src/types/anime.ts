export type AppView = "dashboard" | "studio";

export type AnimeStyle =
  | "shonen"
  | "ninja"
  | "dark-fantasy"
  | "romance"
  | "cyberpunk";
export type Duration = "10s" | "30s" | "1min" | "5min" | "10min" | "20min";

export interface CharacterConfig {
  hairStyle: string;
  hairColor: string;
  eyeGlow: string;
  aura: string;
  outfit: string;
}

export interface SceneConfig {
  background: string;
  weather: string;
  timeOfDay: "day" | "night";
}

export interface AudioConfig {
  voiceover: boolean;
  voiceGender: "male" | "female" | "neutral";
  music: string;
  sfx: string[];
}

export interface AnimeProject {
  id: string;
  name: string;
  createdAt: string;
  style: AnimeStyle;
  prompt: string;
  duration: Duration;
  character: CharacterConfig;
  scene: SceneConfig;
  audio: AudioConfig;
  quality: "720p" | "1080p";
  status: "draft" | "generated";
}

export interface StudioState {
  prompt: string;
  duration: Duration;
  style: AnimeStyle | "";
  character: CharacterConfig;
  scene: SceneConfig;
  audio: AudioConfig;
  quality: "720p" | "1080p";
  projectName: string;
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  hairStyle: "Spiky",
  hairColor: "Black",
  eyeGlow: "None",
  aura: "None",
  outfit: "Casual",
};

export const DEFAULT_SCENE: SceneConfig = {
  background: "City",
  weather: "Clear",
  timeOfDay: "day",
};

export const DEFAULT_AUDIO: AudioConfig = {
  voiceover: false,
  voiceGender: "neutral",
  music: "Epic Battle",
  sfx: [],
};

export const DEFAULT_STUDIO_STATE: StudioState = {
  prompt: "",
  duration: "30s",
  style: "",
  character: DEFAULT_CHARACTER,
  scene: DEFAULT_SCENE,
  audio: DEFAULT_AUDIO,
  quality: "1080p",
  projectName: "",
};
