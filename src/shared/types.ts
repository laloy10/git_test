/**
 * Types shared between the main and renderer processes.
 * Keeping these in one place guarantees the IPC contract stays in sync.
 */

export type AiProvider = 'demo' | 'claude' | 'gemini'

/** Claude models offered in the app. */
export type ClaudeModel = 'claude-opus-5' | 'claude-sonnet-5' | 'claude-haiku-4-5'

export type ThemeMode = 'system' | 'light' | 'dark'

export interface AppSettings {
  provider: AiProvider
  anthropicApiKey: string
  model: ClaudeModel
  /** Google AI Studio API key for the Gemini image engine ("Nano Banana"). */
  geminiApiKey: string
  theme: ThemeMode
}

/** A single colour in a recommended palette. */
export interface PaletteColor {
  name: string
  hex: string
  use: string
}

/**
 * Claude's structured redesign concept for a space — the "smart AI decorating
 * suggestions" / "room makeover concept" the app is built around.
 */
export interface DesignRecommendation {
  title: string
  overview: string
  palette: PaletteColor[]
  keyChanges: string[]
  materials: string[]
  furnishings: string[]
  budgetTip: string
}

/** A single style preset a user can apply to a photo. */
export interface StylePreset {
  id: string
  name: string
  description: string
  /** Prompt fragment handed to the image model. */
  prompt: string
  /** Two-stop gradient used for the preset thumbnail in demo mode. */
  swatch: [string, string]
}

/** A top-level space category (Interior, Garden, Exterior, Paint). */
export interface Category {
  id: string
  name: string
  tagline: string
  icon: string
  accent: string
  styles: StylePreset[]
}

/** Request sent from renderer to main to generate a redesign. */
export interface GenerateRequest {
  /** Source photo as a data URL (image/png or image/jpeg). */
  imageDataUrl: string
  categoryId: string
  categoryName: string
  style: StylePreset
}

export interface GenerateSuccess {
  ok: true
  provider: AiProvider
  /** An AI-generated redesign image (Gemini), as a data URL. */
  imageDataUrl?: string
  /** Claude's structured redesign concept for the space. */
  recommendation?: DesignRecommendation
}

export interface GenerateFailure {
  ok: false
  error: string
}

export type GenerateResult = GenerateSuccess | GenerateFailure

/** A saved project in the local gallery. */
export interface Project {
  id: string
  createdAt: number
  categoryId: string
  categoryName: string
  styleId: string
  styleName: string
  beforeImage: string
  /** Stylised preview of the redesign. */
  afterImage: string
  /** Claude's design plan, when generated with the Claude engine. */
  recommendation?: DesignRecommendation
  provider: AiProvider
}
