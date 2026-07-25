import type { DesignRecommendation, GenerateRequest } from '../../../shared/types'
import { generateDemo } from './demo'

export type RunResult =
  | { ok: true; imageDataUrl: string; recommendation?: DesignRecommendation }
  | { ok: false; error: string }

/**
 * Front-end generation entry point.
 *
 * - Demo: an offline local style render (canvas colour grading).
 * - Claude: local style render + a structured AI design plan from Claude.
 * - Gemini ("Nano Banana"): a real AI-edited image of the space.
 *
 * Cloud engines run through the main process, where the API key lives.
 */
export async function runGeneration(provider: string, req: GenerateRequest): Promise<RunResult> {
  // Gemini returns the actual redesigned image — no local preview needed.
  if (provider === 'gemini') {
    const res = await window.api.generate(req)
    if (!res.ok) return { ok: false, error: res.error }
    if (!res.imageDataUrl) return { ok: false, error: 'Gemini returned no image.' }
    return { ok: true, imageDataUrl: res.imageDataUrl }
  }

  // Demo and Claude both use the local style render for the visual preview.
  let imageDataUrl: string
  try {
    imageDataUrl = await generateDemo(req.imageDataUrl, req.style)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Preview generation failed.' }
  }

  if (provider !== 'claude') {
    return { ok: true, imageDataUrl }
  }

  const res = await window.api.generate(req)
  if (!res.ok) return { ok: false, error: res.error }
  return { ok: true, imageDataUrl, recommendation: res.recommendation }
}
