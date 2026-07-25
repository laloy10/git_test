import { BrowserWindow, dialog, ipcMain, nativeTheme } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { IPC } from '../shared/ipc'
import type { AppSettings, GenerateRequest, Project } from '../shared/types'
import { generate } from './ai'
import {
  addProject,
  clearProjects,
  deleteProject,
  getProjects,
  getSettings,
  saveSettings
} from './store'

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
}

/** Register every IPC handler. Called once after the app is ready. */
export function registerIpcHandlers(): void {
  ipcMain.handle(IPC.getSettings, () => getSettings())

  ipcMain.handle(IPC.saveSettings, (_e, patch: Partial<AppSettings>) => {
    const next = saveSettings(patch)
    if (patch.theme) nativeTheme.themeSource = patch.theme
    return next
  })

  ipcMain.handle(IPC.getProjects, () => getProjects())
  ipcMain.handle(IPC.addProject, (_e, project: Project) => addProject(project))
  ipcMain.handle(IPC.deleteProject, (_e, id: string) => deleteProject(id))
  ipcMain.handle(IPC.clearProjects, () => clearProjects())

  ipcMain.handle(IPC.generate, (_e, req: GenerateRequest) => generate(req))

  // Open a photo from disk and return it as a data URL.
  ipcMain.handle(IPC.openImage, async () => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showOpenDialog(win!, {
      title: 'Choose a photo',
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }]
    })
    if (result.canceled || result.filePaths.length === 0) return null

    const filePath = result.filePaths[0]
    const mime = MIME_BY_EXT[extname(filePath).toLowerCase()] ?? 'image/png'
    const buffer = await readFile(filePath)
    return `data:${mime};base64,${buffer.toString('base64')}`
  })

  // Save a generated image (data URL) to disk.
  ipcMain.handle(IPC.saveImage, async (_e, dataUrl: string, suggestedName: string) => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showSaveDialog(win!, {
      title: 'Save design',
      defaultPath: suggestedName,
      filters: [{ name: 'PNG image', extensions: ['png'] }]
    })
    if (result.canceled || !result.filePath) return false

    const base64 = dataUrl.replace(/^data:.+?;base64,/, '')
    await writeFile(result.filePath, Buffer.from(base64, 'base64'))
    return true
  })
}
