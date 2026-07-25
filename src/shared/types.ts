/**
 * Types shared between the main and renderer processes.
 * Keeping these in one place guarantees the IPC contract stays in sync.
 */

export type AiProvider = 'demo' | 'openai'

export type ThemeMode = 'system' | 'light' | 'dark'

export interface AppSettings {
  provider: AiProvider
  openaiApiKey: string
  theme: ThemeMode
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
  /** Resulting image as a data URL. */
  imageDataUrl: string
  provider: AiProvider
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
  afterImage: string
  provider: AiProvider
}
