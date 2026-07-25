import type { GenerateRequest, GenerateResult } from '../../shared/types'
import { getSettings } from '../store'
import { generateWithOpenAI } from './openai'

/**
 * Dispatch a generation request to the configured provider.
 *
 * Demo mode is handled entirely in the renderer (offline canvas stylisation),
 * so this is only reached for real cloud providers such as OpenAI.
 */
export async function generate(req: GenerateRequest): Promise<GenerateResult> {
  const settings = getSettings()

  switch (settings.provider) {
    case 'openai':
      return generateWithOpenAI(req, settings.openaiApiKey)
    case 'demo':
    default:
      return {
        ok: false,
        error: 'Demo mode is handled locally in the app. No cloud call is needed.'
      }
  }
}
