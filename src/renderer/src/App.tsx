import { useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { HomeScreen } from './screens/HomeScreen'
import { StudioScreen } from './screens/StudioScreen'
import { GalleryScreen } from './screens/GalleryScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { useAppStore } from './store/useAppStore'

export default function App(): JSX.Element {
  const ready = useAppStore((s) => s.ready)
  const route = useAppStore((s) => s.route)
  const init = useAppStore((s) => s.init)

  useEffect(() => {
    void init()
  }, [init])

  if (!ready) {
    return (
      <div className="app" style={{ gridTemplateColumns: '1fr' }}>
        <div className="stage-overlay">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        {route === 'home' && <HomeScreen />}
        {route === 'studio' && <StudioScreen />}
        {route === 'gallery' && <GalleryScreen />}
        {route === 'settings' && <SettingsScreen />}
      </main>
    </div>
  )
}
