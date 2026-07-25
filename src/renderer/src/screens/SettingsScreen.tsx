import { useState } from 'react'
import { Check, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { AiProvider, ThemeMode } from '../../../shared/types'

const THEMES: Array<{ id: ThemeMode; label: string }> = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
]

export function SettingsScreen(): JSX.Element {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)

  const [key, setKey] = useState(settings.openaiApiKey)
  const [showKey, setShowKey] = useState(false)
  const [savedKey, setSavedKey] = useState(false)

  const saveKey = async (): Promise<void> => {
    await updateSettings({ openaiApiKey: key.trim() })
    setSavedKey(true)
    setTimeout(() => setSavedKey(false), 1600)
  }

  return (
    <div className="content" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Configure how designs are generated and how the app looks.</p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Generation engine</label>
          <div className="seg">
            {(['demo', 'openai'] as AiProvider[]).map((p) => (
              <button
                key={p}
                className={settings.provider === p ? 'active' : ''}
                onClick={() => updateSettings({ provider: p })}
              >
                {p === 'demo' ? 'Demo (offline)' : 'OpenAI'}
              </button>
            ))}
          </div>
          <div className="hint">
            {settings.provider === 'demo'
              ? 'Demo mode restyles your photo locally with colour grading — no account or internet needed. Great for trying the app.'
              : 'OpenAI mode sends your photo to gpt-image-1 for a full photorealistic redesign. Requires an API key.'}
          </div>
        </div>
      </div>

      {settings.provider === 'openai' && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>OpenAI API key</label>
            <div className="row">
              <input
                className="input"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-…"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <button
                className="btn btn-ghost"
                onClick={() => setShowKey((v) => !v)}
                title={showKey ? 'Hide' : 'Show'}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button className="btn btn-primary" onClick={saveKey}>
                {savedKey ? <Check size={16} /> : null}
                {savedKey ? 'Saved' : 'Save'}
              </button>
            </div>
            <div className="hint">
              Stored locally on this device only. Get a key at{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
                platform.openai.com <ExternalLink size={11} style={{ verticalAlign: 'middle' }} />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Appearance</label>
          <div className="seg">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={settings.theme === t.id ? 'active' : ''}
                onClick={() => updateSettings({ theme: t.id })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
