import type { Category } from '../../../shared/types'

/**
 * Curated categories and style presets — the guided "choose a style" library
 * that mirrors the source app's interior / garden / exterior / paint flows.
 */
export const CATEGORIES: Category[] = [
  {
    id: 'interior',
    name: 'Interior',
    tagline: 'Reimagine any room',
    icon: 'sofa',
    accent: '#7c5cff',
    styles: [
      {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'Clean lines, neutral palette, uncluttered calm.',
        prompt:
          'minimalist modern interior, neutral tones, natural light, warm wood accents, uncluttered, high-end finishes',
        swatch: ['#d7d2c8', '#8a8577']
      },
      {
        id: 'scandinavian',
        name: 'Scandinavian',
        description: 'Light woods, soft textiles, cosy and bright.',
        prompt:
          'scandinavian interior, pale oak, white walls, cosy textiles, hygge, plants, soft daylight',
        swatch: ['#f2ede4', '#c8b79a']
      },
      {
        id: 'japandi',
        name: 'Japandi',
        description: 'Japanese calm meets Scandinavian warmth.',
        prompt:
          'japandi interior, low furniture, muted earthy palette, natural materials, wabi-sabi, serene',
        swatch: ['#c9beac', '#6f6353']
      },
      {
        id: 'mid-century',
        name: 'Mid-Century',
        description: 'Retro silhouettes, walnut, bold accents.',
        prompt:
          'mid-century modern interior, walnut furniture, retro accents, warm palette, statement lighting',
        swatch: ['#c98a54', '#5c3a21']
      },
      {
        id: 'industrial',
        name: 'Industrial',
        description: 'Exposed brick, steel, raw and moody.',
        prompt:
          'industrial loft interior, exposed brick, steel, concrete, Edison bulbs, leather, moody',
        swatch: ['#7a736b', '#2f2b28']
      },
      {
        id: 'coastal',
        name: 'Coastal',
        description: 'Airy blues, linen, relaxed seaside light.',
        prompt:
          'coastal interior, soft blues and whites, linen, rattan, breezy, bright natural light',
        swatch: ['#bfe0e6', '#5b93a3']
      }
    ]
  },
  {
    id: 'garden',
    name: 'Garden',
    tagline: 'Transform your outdoor space',
    icon: 'trees',
    accent: '#3bb273',
    styles: [
      {
        id: 'lush-cottage',
        name: 'Lush Cottage',
        description: 'Overflowing borders, roses, romantic planting.',
        prompt:
          'lush english cottage garden, hydrangeas, roses, dense flowering borders, stone path, romantic',
        swatch: ['#8fce7d', '#3f7a3a']
      },
      {
        id: 'modern-patio',
        name: 'Modern Patio',
        description: 'Sleek pavers, lounge seating, fire feature.',
        prompt:
          'modern outdoor patio, large pavers, sectional lounge, gas fire feature, architectural planting, string lights',
        swatch: ['#b7b1a3', '#5e5a50']
      },
      {
        id: 'zen',
        name: 'Zen Retreat',
        description: 'Gravel, water, sculpted greenery, calm.',
        prompt:
          'japanese zen garden, raked gravel, water basin, sculpted shrubs, stepping stones, tranquil',
        swatch: ['#a8b79a', '#4c5b45']
      },
      {
        id: 'mediterranean',
        name: 'Mediterranean',
        description: 'Olive, terracotta, lavender, sun-drenched.',
        prompt:
          'mediterranean garden, olive trees, terracotta pots, lavender, gravel, warm stone, sunlit',
        swatch: ['#c7b489', '#7a6b3f']
      },
      {
        id: 'tropical',
        name: 'Tropical',
        description: 'Big foliage, palms, vivid and lush.',
        prompt:
          'tropical garden, large-leaf foliage, palms, ferns, vivid greens, lush layered planting',
        swatch: ['#5fbf7a', '#1f6b3a']
      },
      {
        id: 'kids-lawn',
        name: 'Family Lawn',
        description: 'Neat lawn, play space, tidy beds.',
        prompt:
          'family friendly backyard, neat green lawn, tidy planting beds, play area, clean and safe',
        swatch: ['#8ecb6a', '#3d6b2e']
      }
    ]
  },
  {
    id: 'exterior',
    name: 'Exterior',
    tagline: 'Refresh your home’s facade',
    icon: 'home',
    accent: '#e0883b',
    styles: [
      {
        id: 'modern-facade',
        name: 'Modern Facade',
        description: 'Dark cladding, clean geometry, warm timber.',
        prompt:
          'modern house exterior, dark cladding, timber accents, flat clean lines, minimal landscaping',
        swatch: ['#6b6660', '#2c2a27']
      },
      {
        id: 'farmhouse',
        name: 'Modern Farmhouse',
        description: 'White board, black trim, gabled charm.',
        prompt:
          'modern farmhouse exterior, white board and batten, black window trim, metal roof, porch',
        swatch: ['#eae6df', '#3a3733']
      },
      {
        id: 'craftsman',
        name: 'Craftsman',
        description: 'Warm earth tones, tapered columns, detail.',
        prompt:
          'craftsman house exterior, earth tones, tapered columns, exposed rafters, natural stone base',
        swatch: ['#b08a5a', '#5c4326']
      },
      {
        id: 'coastal-exterior',
        name: 'Coastal',
        description: 'Soft blues, weatherboard, breezy light.',
        prompt:
          'coastal house exterior, soft blue weatherboard, white trim, bright airy, seaside planting',
        swatch: ['#a9cdd6', '#4f7f8b']
      },
      {
        id: 'mediterranean-exterior',
        name: 'Mediterranean',
        description: 'Stucco, terracotta roof, arches.',
        prompt:
          'mediterranean villa exterior, warm stucco, terracotta tile roof, arched windows, cypress trees',
        swatch: ['#d8b98d', '#8a6234']
      },
      {
        id: 'black-modern',
        name: 'Bold Black',
        description: 'Dramatic dark exterior, sharp accents.',
        prompt:
          'bold black modern house exterior, matte black cladding, warm wood door, dramatic, sleek',
        swatch: ['#3d3a36', '#0f0e0d']
      }
    ]
  },
  {
    id: 'paint',
    name: 'Paint',
    tagline: 'Try a new colour instantly',
    icon: 'palette',
    accent: '#e05b8f',
    styles: [
      {
        id: 'warm-white',
        name: 'Warm White',
        description: 'Soft, inviting off-white walls.',
        prompt: 'walls repainted in a warm soft white, cosy neutral, unchanged furniture and layout',
        swatch: ['#f4efe6', '#e2d8c6']
      },
      {
        id: 'sage-green',
        name: 'Sage Green',
        description: 'Calming muted green.',
        prompt: 'walls repainted in a muted sage green, calming, unchanged furniture and layout',
        swatch: ['#b7c3a3', '#7d8c66']
      },
      {
        id: 'deep-navy',
        name: 'Deep Navy',
        description: 'Rich, dramatic navy blue.',
        prompt: 'walls repainted in a deep navy blue, dramatic and rich, unchanged furniture and layout',
        swatch: ['#3a4a63', '#1d2740']
      },
      {
        id: 'terracotta',
        name: 'Terracotta',
        description: 'Earthy warm clay tone.',
        prompt: 'walls repainted in a warm terracotta clay tone, earthy, unchanged furniture and layout',
        swatch: ['#cd8a63', '#a15c3a']
      },
      {
        id: 'charcoal',
        name: 'Charcoal',
        description: 'Moody dark grey.',
        prompt: 'walls repainted in a moody charcoal grey, sophisticated, unchanged furniture and layout',
        swatch: ['#5c5a58', '#2e2d2c']
      },
      {
        id: 'blush',
        name: 'Blush Pink',
        description: 'Soft, warm blush.',
        prompt: 'walls repainted in a soft blush pink, warm and gentle, unchanged furniture and layout',
        swatch: ['#eec9c6', '#d59a97']
      }
    ]
  }
]

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
