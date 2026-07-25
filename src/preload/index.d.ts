import type { HomeAiApi } from './index'

declare global {
  interface Window {
    api: HomeAiApi
  }
}

export {}
