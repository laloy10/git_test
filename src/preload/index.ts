import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipc'
import type {
  AppSettings,
  GenerateRequest,
  GenerateResult,
  Project
} from '../shared/types'

/**
 * The single, typed surface the renderer is allowed to touch. Everything
 * crosses the context bridge — the renderer never gets Node or ipcRenderer
 * directly (contextIsolation + nodeIntegration:false).
 */
const api = {
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC.getSettings),
  saveSettings: (patch: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC.saveSettings, patch),

  getProjects: (): Promise<Project[]> => ipcRenderer.invoke(IPC.getProjects),
  addProject: (project: Project): Promise<Project[]> => ipcRenderer.invoke(IPC.addProject, project),
  deleteProject: (id: string): Promise<Project[]> => ipcRenderer.invoke(IPC.deleteProject, id),
  clearProjects: (): Promise<Project[]> => ipcRenderer.invoke(IPC.clearProjects),

  generate: (req: GenerateRequest): Promise<GenerateResult> => ipcRenderer.invoke(IPC.generate, req),

  openImage: (): Promise<string | null> => ipcRenderer.invoke(IPC.openImage),
  saveImage: (dataUrl: string, suggestedName: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC.saveImage, dataUrl, suggestedName)
}

export type HomeAiApi = typeof api

contextBridge.exposeInMainWorld('api', api)
