import type { GenerateRequest, GenerateResult } from '../../../shared/types'
import { generateDemo } from './demo'

/**
 * Front-end generation entry point. Demo mode runs locally in the renderer;
 * every real provider goes through the main process (secure key handling).
 */
export async function runGeneration(
  provider: string,
  req: GenerateRequest
): Promise<GenerateResult> {
  if (provider === 'demo') {
    try {
      const imageDataUrl = await generateDemo(req.imageDataUrl, req.style)
      return { ok: true, provider: 'demo', imageDataUrl }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Demo generation failed.' }
    }
  }
  return window.api.generate(req)
}
