import { create } from 'zustand'
import type { AppSettings, DesignRecommendation, Project, StylePreset } from '../../../shared/types'
import { CATEGORIES } from '../data/categories'
import { runGeneration } from '../lib/ai'

export type Route = 'home' | 'studio' | 'gallery' | 'settings'

interface AppState {
  ready: boolean
  route: Route
  settings: AppSettings
  projects: Project[]

  // Active studio session
  categoryId: string
  sourceImage: string | null
  selectedStyle: StylePreset | null
  resultImage: string | null
  recommendation: DesignRecommendation | null
  generating: boolean
  error: string | null

  // actions
  init: () => Promise<void>
  navigate: (route: Route) => void
  openCategory: (categoryId: string) => void
  setSourceImage: (dataUrl: string | null) => void
  selectStyle: (style: StylePreset) => void
  generate: () => Promise<void>
  saveCurrentToGallery: () => Promise<void>
  resetStudio: () => void
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  clearProjects: () => Promise<void>
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  route: 'home',
  settings: {
    provider: 'demo',
    anthropicApiKey: '',
    model: 'claude-opus-5',
    geminiApiKey: '',
    theme: 'system'
  },
  projects: [],

  categoryId: 'interior',
  sourceImage: null,
  selectedStyle: null,
  resultImage: null,
  recommendation: null,
  generating: false,
  error: null,

  init: async () => {
    const [settings, projects] = await Promise.all([
      window.api.getSettings(),
      window.api.getProjects()
    ])
    set({ settings, projects, ready: true })
  },

  navigate: (route) => set({ route }),

  openCategory: (categoryId) => {
    const category = CATEGORIES.find((c) => c.id === categoryId)
    set({
      categoryId,
      route: 'studio',
      selectedStyle: category?.styles[0] ?? null,
      resultImage: null,
      recommendation: null,
      error: null
    })
  },

  setSourceImage: (dataUrl) =>
    set({ sourceImage: dataUrl, resultImage: null, recommendation: null, error: null }),

  selectStyle: (style) => set({ selectedStyle: style, error: null }),

  generate: async () => {
    const { sourceImage, selectedStyle, categoryId, settings } = get()
    if (!sourceImage || !selectedStyle) return

    const category = CATEGORIES.find((c) => c.id === categoryId)
    set({ generating: true, error: null, resultImage: null, recommendation: null })

    const res = await runGeneration(settings.provider, {
      imageDataUrl: sourceImage,
      categoryId,
      categoryName: category?.name ?? categoryId,
      style: selectedStyle
    })

    if (res.ok) {
      set({
        resultImage: res.imageDataUrl,
        recommendation: res.recommendation ?? null,
        generating: false
      })
    } else {
      set({ error: res.error, generating: false })
    }
  },

  saveCurrentToGallery: async () => {
    const { sourceImage, resultImage, recommendation, selectedStyle, categoryId, settings } = get()
    if (!sourceImage || !resultImage || !selectedStyle) return

    const category = CATEGORIES.find((c) => c.id === categoryId)
    const project: Project = {
      id: uid(),
      createdAt: Date.now(),
      categoryId,
      categoryName: category?.name ?? categoryId,
      styleId: selectedStyle.id,
      styleName: selectedStyle.name,
      beforeImage: sourceImage,
      afterImage: resultImage,
      recommendation: recommendation ?? undefined,
      provider: settings.provider
    }
    const projects = await window.api.addProject(project)
    set({ projects })
  },

  resetStudio: () =>
    set({
      sourceImage: null,
      resultImage: null,
      recommendation: null,
      error: null,
      generating: false
    }),

  updateSettings: async (patch) => {
    const settings = await window.api.saveSettings(patch)
    set({ settings })
  },

  deleteProject: async (id) => {
    const projects = await window.api.deleteProject(id)
    set({ projects })
  },

  clearProjects: async () => {
    const projects = await window.api.clearProjects()
    set({ projects })
  }
}))
