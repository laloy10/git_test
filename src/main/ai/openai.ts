import type { GenerateRequest, GenerateResult } from '../../shared/types'

const IMAGE_EDIT_ENDPOINT = 'https://api.openai.com/v1/images/edits'

/** Parse a `data:` URL into its mime type and raw bytes. */
function dataUrlToBuffer(dataUrl: string): { mime: string; buffer: Buffer } {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl)
  if (!match) throw new Error('Unsupported image format (expected a base64 data URL).')
  return { mime: match[1], buffer: Buffer.from(match[2], 'base64') }
}

function buildPrompt(req: GenerateRequest): string {
  return [
    `Redesign this ${req.categoryName.toLowerCase()} photo in a ${req.style.name} style.`,
    req.style.prompt,
    'Keep the original architecture, camera angle, perspective, walls, windows and permanent',
    'structures intact. Only restyle finishes, furniture, decor, planting and colour.',
    'Produce a single photorealistic result at high quality.'
  ].join(' ')
}

/**
 * Generate a redesign with OpenAI's image edit endpoint (gpt-image-1).
 * Runs in the main process so the API key never reaches the renderer.
 */
export async function generateWithOpenAI(
  req: GenerateRequest,
  apiKey: string
): Promise<GenerateResult> {
  if (!apiKey) {
    return { ok: false, error: 'No OpenAI API key set. Add one in Settings or switch to Demo mode.' }
  }

  try {
    const { mime, buffer } = dataUrlToBuffer(req.imageDataUrl)
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg'

    const form = new FormData()
    form.append('model', 'gpt-image-1')
    form.append('prompt', buildPrompt(req))
    form.append('size', '1024x1024')
    form.append('n', '1')
    form.append('image', new Blob([new Uint8Array(buffer)], { type: mime }), `source.${ext}`)

    const res = await fetch(IMAGE_EDIT_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { ok: false, error: `OpenAI request failed (${res.status}). ${detail.slice(0, 300)}` }
    }

    const json = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> }
    const item = json.data?.[0]
    if (item?.b64_json) {
      return { ok: true, provider: 'openai', imageDataUrl: `data:image/png;base64,${item.b64_json}` }
    }
    if (item?.url) {
      const img = await fetch(item.url)
      const arrayBuf = await img.arrayBuffer()
      const b64 = Buffer.from(arrayBuf).toString('base64')
      return { ok: true, provider: 'openai', imageDataUrl: `data:image/png;base64,${b64}` }
    }
    return { ok: false, error: 'OpenAI returned no image data.' }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error calling OpenAI.' }
  }
}
