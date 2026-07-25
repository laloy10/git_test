import type { DesignRecommendation, GenerateRequest } from '../../../shared/types'
import { generateDemo } from './demo'

export type RunResult =
  | { ok: true; imageDataUrl: string; recommendation?: DesignRecommendation }
  | { ok: false; error: string }

/**
 * Front-end generation entry point.
 *
 * The visual before/after preview is always produced locally (offline canvas
 * stylisation). With the Claude engine we additionally ask Claude — through the
 * main process, where the API key lives — for a structured design plan for the
 * space.
 */
export async function runGeneration(provider: string, req: GenerateRequest): Promise<RunResult> {
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
