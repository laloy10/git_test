import type { GenerateRequest, GenerateResult } from '../../shared/types'

/**
 * Google Gemini image model — "Nano Banana". Instruction-based image editing:
 * we send the source photo + a restyle instruction and get an edited photo
 * back. Runs in the main process so the API key never reaches the renderer.
 *
 * Model / free-tier limits can change over time — see Google AI Studio.
 */
const MODEL = 'gemini-2.5-flash-image'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

interface GeminiPart {
  text?: string
  inlineData?: { mimeType: string; data: string }
}
interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: GeminiPart[] }; finishReason?: string }>
  promptFeedback?: { blockReason?: string }
  error?: { message?: string }
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl)
  if (!match) throw new Error('Unsupported image format (expected a base64 data URL).')
  return { mimeType: match[1], data: match[2] }
}

function buildPrompt(req: GenerateRequest): string {
  return [
    `Restyle this ${req.categoryName.toLowerCase()} photo in a ${req.style.name} style.`,
    `${req.style.prompt}.`,
    'Keep the exact same room structure, camera angle, perspective, walls, windows, doors and',
    'permanent fixtures. Only change finishes, colours, furniture, planting and decor to match',
    'the style. Return a single photorealistic edited image of the same space.'
  ].join(' ')
}

export async function generateWithGemini(
  req: GenerateRequest,
  apiKey: string
): Promise<GenerateResult> {
  if (!apiKey) {
    return {
      ok: false,
      error: 'No Google (Gemini) API key set. Add one in Settings, or switch to Demo mode.'
    }
  }

  let mimeType: string
  let data: string
  try {
    const parsed = parseDataUrl(req.imageDataUrl)
    mimeType = parsed.mimeType
    data = parsed.data
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not read the image.' }
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(req) }, { inline_data: { mime_type: mimeType, data } }]
          }
        ],
        generationConfig: { responseModalities: ['IMAGE'] }
      })
    })

    const json = (await res.json().catch(() => ({}))) as GeminiResponse

    if (!res.ok) {
      const detail = json.error?.message ?? `HTTP ${res.status}`
      return { ok: false, error: `Gemini request failed: ${detail}` }
    }

    if (json.promptFeedback?.blockReason) {
      return { ok: false, error: `Gemini blocked this request (${json.promptFeedback.blockReason}).` }
    }

    const parts = json.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p) => p.inlineData?.data)
    if (imagePart?.inlineData) {
      const out = imagePart.inlineData
      return { ok: true, provider: 'gemini', imageDataUrl: `data:${out.mimeType};base64,${out.data}` }
    }

    // No image came back — surface any text Gemini returned instead.
    const text = parts.find((p) => p.text)?.text
    return {
      ok: false,
      error: text ? `Gemini returned no image: ${text.slice(0, 200)}` : 'Gemini returned no image.'
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error calling Gemini.' }
  }
}
