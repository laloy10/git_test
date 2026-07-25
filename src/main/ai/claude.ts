import Anthropic from '@anthropic-ai/sdk'
import type { ClaudeModel, DesignRecommendation, GenerateRequest, GenerateResult } from '../../shared/types'

function parseDataUrl(dataUrl: string): { mediaType: string; data: string } {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl)
  if (!match) throw new Error('Unsupported image format (expected a base64 data URL).')
  return { mediaType: match[1], data: match[2] }
}

const SHAPE = `{
  "title": string,                       // short evocative name for the concept
  "overview": string,                    // 2-3 sentences on the transformed space and its mood
  "palette": [{ "name": string, "hex": string, "use": string }],  // 4-6 colours
  "keyChanges": string[],                // 4-7 concrete changes for THIS space
  "materials": string[],                 // key materials / finishes / textures
  "furnishings": string[],               // furniture, planting or decor pieces
  "budgetTip": string                    // one high-impact, affordable suggestion
}`

function buildPrompt(req: GenerateRequest): string {
  return [
    `I'm redesigning this ${req.categoryName.toLowerCase()} and want to explore a "${req.style.name}" direction.`,
    `Style intent: ${req.style.prompt}.`,
    'Study the photo carefully — the actual layout, fixed features, light and proportions — and',
    'produce a practical redesign concept tailored to THIS space (not generic advice).',
    'Keep the permanent structure; focus on finishes, colour, furnishing, planting and decor.',
    '',
    'Respond with ONLY a single JSON object (no markdown fences, no prose) of this exact shape:',
    SHAPE
  ].join('\n')
}

/** Pull the JSON object out of a model reply, tolerating stray prose or fences. */
function parseRecommendation(text: string): DesignRecommendation {
  let raw = text.trim()
  const fence = /```(?:json)?\s*([\s\S]*?)```/.exec(raw)
  if (fence) raw = fence[1].trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end !== -1) raw = raw.slice(start, end + 1)
  return JSON.parse(raw) as DesignRecommendation
}

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

const SUPPORTED_MEDIA: ImageMediaType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

/**
 * Generate a structured redesign concept with Claude's vision model.
 * Runs in the main process so the API key never reaches the renderer.
 */
export async function generateWithClaude(
  req: GenerateRequest,
  apiKey: string,
  model: ClaudeModel
): Promise<GenerateResult> {
  if (!apiKey) {
    return {
      ok: false,
      error: 'No Anthropic API key set. Add one in Settings, or switch to Demo mode.'
    }
  }

  let mediaType: string
  let data: string
  try {
    const parsed = parseDataUrl(req.imageDataUrl)
    mediaType = parsed.mediaType
    data = parsed.data
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not read the image.' }
  }

  if (!SUPPORTED_MEDIA.includes(mediaType as ImageMediaType)) {
    return { ok: false, error: `Unsupported image type "${mediaType}". Use JPG, PNG, GIF or WEBP.` }
  }

  const client = new Anthropic({ apiKey })

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 2048,
      system:
        'You are an expert interior, garden and exterior designer. You give specific, tasteful, ' +
        'actionable redesign concepts grounded in what you actually see in the photo. ' +
        'You always reply with a single raw JSON object and nothing else.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType as ImageMediaType, data }
            },
            { type: 'text', text: buildPrompt(req) }
          ]
        }
      ]
    })

    if (message.stop_reason === 'refusal') {
      return { ok: false, error: 'Claude declined this request. Try a different photo or style.' }
    }

    const textBlock = message.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
    if (!textBlock) return { ok: false, error: 'Claude returned no design plan.' }

    try {
      const recommendation = parseRecommendation(textBlock.text)
      return { ok: true, provider: 'claude', recommendation }
    } catch {
      return { ok: false, error: 'Could not parse Claude’s design plan. Please try again.' }
    }
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return { ok: false, error: `Claude request failed (${err.status ?? '?'}): ${err.message}` }
    }
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error calling Claude.' }
  }
}
