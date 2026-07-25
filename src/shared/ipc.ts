/** Canonical IPC channel names shared by main, preload and renderer. */
export const IPC = {
  getSettings: 'settings:get',
  saveSettings: 'settings:save',
  getProjects: 'projects:get',
  addProject: 'projects:add',
  deleteProject: 'projects:delete',
  clearProjects: 'projects:clear',
  generate: 'ai:generate',
  openImage: 'dialog:openImage',
  saveImage: 'dialog:saveImage',
  themeChanged: 'theme:changed'
} as const
