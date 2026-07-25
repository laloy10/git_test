import type { GenerateRequest, GenerateResult } from '../../shared/types'
import { getSettings } from '../store'
import { generateWithClaude } from './claude'

/**
 * Dispatch a generation request to the configured provider.
 *
 * Demo mode is handled entirely in the renderer (offline canvas stylisation),
 * so this is only reached for the Claude engine.
 */
export async function generate(req: GenerateRequest): Promise<GenerateResult> {
  const settings = getSettings()

  switch (settings.provider) {
    case 'claude':
      return generateWithClaude(req, settings.anthropicApiKey, settings.model)
    case 'demo':
    default:
      return {
        ok: false,
        error: 'Demo mode is handled locally in the app. No cloud call is needed.'
      }
  }
}
