import { Home, Images, Settings, Sparkles, Wand2 } from 'lucide-react'
import { useAppStore, type Route } from '../store/useAppStore'

const NAV: Array<{ route: Route; label: string; icon: JSX.Element }> = [
  { route: 'home', label: 'Home', icon: <Home size={18} /> },
  { route: 'studio', label: 'Studio', icon: <Wand2 size={18} /> },
  { route: 'gallery', label: 'Gallery', icon: <Images size={18} /> },
  { route: 'settings', label: 'Settings', icon: <Settings size={18} /> }
]

export function Sidebar(): JSX.Element {
  const route = useAppStore((s) => s.route)
  const navigate = useAppStore((s) => s.navigate)
  const provider = useAppStore((s) => s.settings.provider)

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        <div>
          <div className="brand-name">Home AI Studio</div>
          <div className="brand-sub">Redesign any space</div>
        </div>
      </div>

      {NAV.map((item) => (
        <button
          key={item.route}
          className={`nav-item ${route === item.route ? 'active' : ''}`}
          onClick={() => navigate(item.route)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}

      <div className="sidebar-spacer" />

      <div className="sidebar-foot">
        Mode: <strong>{provider === 'demo' ? 'Demo' : 'Claude'}</strong>
        <br />
        v1.0.0
      </div>
    </aside>
  )
}
