import type { StylePreset } from '../../../shared/types'

/**
 * Demo generator. There is no cloud call — we produce a believable "after"
 * by colour-grading the source photo toward the preset's swatch and applying
 * a tasteful tone curve. It runs fully offline so the app works out of the box.
 */

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '')
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)]
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read the source image.'))
    img.src = src
  })
}

const clamp = (n: number): number => (n < 0 ? 0 : n > 255 ? 255 : n)

export async function generateDemo(imageDataUrl: string, style: StylePreset): Promise<string> {
  const img = await loadImage(imageDataUrl)

  // Cap the working resolution so grading stays fast on large photos.
  const maxDim = 1400
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported.')

  ctx.drawImage(img, 0, 0, w, h)
  const image = ctx.getImageData(0, 0, w, h)
  const data = image.data

  const [sr, sg, sb] = hexToRgb(style.swatch[0])
  const [dr, dg, db] = hexToRgb(style.swatch[1])
  // Midpoint of the swatch is our grade target.
  const tr = (sr + dr) / 2
  const tg = (sg + dg) / 2
  const tb = (sb + db) / 2

  const tint = 0.22 // pull toward the target colour
  const contrast = 1.14 // gentle S-curve
  const saturation = 1.12

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    // Contrast around mid-grey.
    r = clamp((r - 128) * contrast + 128)
    g = clamp((g - 128) * contrast + 128)
    b = clamp((b - 128) * contrast + 128)

    // Saturation relative to luma.
    const luma = 0.299 * r + 0.587 * g + 0.114 * b
    r = clamp(luma + (r - luma) * saturation)
    g = clamp(luma + (g - luma) * saturation)
    b = clamp(luma + (b - luma) * saturation)

    // Colour grade toward the preset target.
    data[i] = clamp(r * (1 - tint) + tr * tint)
    data[i + 1] = clamp(g * (1 - tint) + tg * tint)
    data[i + 2] = clamp(b * (1 - tint) + tb * tint)
  }

  ctx.putImageData(image, 0, 0)

  // Soft vignette for a finished, editorial feel.
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.18)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  return canvas.toDataURL('image/png')
}
