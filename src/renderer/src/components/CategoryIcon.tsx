import { Home, Palette, Sofa, TreePine } from 'lucide-react'

const MAP: Record<string, typeof Home> = {
  sofa: Sofa,
  trees: TreePine,
  home: Home,
  palette: Palette
}

export function CategoryIcon({ name, size = 22 }: { name: string; size?: number }): JSX.Element {
  const Cmp = MAP[name] ?? Sofa
  return <Cmp size={size} />
}
