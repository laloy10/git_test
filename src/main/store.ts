import Store from 'electron-store'
import type { AppSettings, Project } from '../shared/types'

interface Schema {
  settings: AppSettings
  projects: Project[]
}

const defaults: Schema = {
  settings: {
    provider: 'demo',
    anthropicApiKey: '',
    model: 'claude-opus-5',
    theme: 'system'
  },
  projects: []
}

/**
 * Persistent app state. electron-store writes JSON to the OS user-data dir,
 * so settings and the project gallery survive restarts.
 */
const store = new Store<Schema>({ defaults, name: 'home-ai-studio' })

export function getSettings(): AppSettings {
  return store.get('settings')
}

export function saveSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...store.get('settings'), ...patch }
  store.set('settings', next)
  return next
}

export function getProjects(): Project[] {
  return store.get('projects')
}

export function addProject(project: Project): Project[] {
  const next = [project, ...store.get('projects')].slice(0, 200)
  store.set('projects', next)
  return next
}

export function deleteProject(id: string): Project[] {
  const next = store.get('projects').filter((p) => p.id !== id)
  store.set('projects', next)
  return next
}

export function clearProjects(): Project[] {
  store.set('projects', [])
  return []
}
