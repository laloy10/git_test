import { useState } from 'react'
import { Check, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { AiProvider, ClaudeModel, ThemeMode } from '../../../shared/types'

const THEMES: Array<{ id: ThemeMode; label: string }> = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
]

const MODELS: Array<{ id: ClaudeModel; label: string; note: string }> = [
  { id: 'claude-opus-5', label: 'Claude Opus 5', note: 'Most capable — richest design plans' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', note: 'Balanced speed and quality' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', note: 'Fastest and most economical' }
]

export function SettingsScreen(): JSX.Element {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)

  const [key, setKey] = useState(settings.anthropicApiKey)
  const [showKey, setShowKey] = useState(false)
  const [savedKey, setSavedKey] = useState(false)

  const [gKey, setGKey] = useState(settings.geminiApiKey)
  const [showGKey, setShowGKey] = useState(false)
  const [savedGKey, setSavedGKey] = useState(false)

  const saveKey = async (): Promise<void> => {
    await updateSettings({ anthropicApiKey: key.trim() })
    setSavedKey(true)
    setTimeout(() => setSavedKey(false), 1600)
  }

  const saveGKey = async (): Promise<void> => {
    await updateSettings({ geminiApiKey: gKey.trim() })
    setSavedGKey(true)
    setTimeout(() => setSavedGKey(false), 1600)
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
            {(
              [
                ['demo', 'Demo (offline)'],
                ['claude', 'Claude (plan)'],
                ['gemini', 'Gemini (image)']
              ] as Array<[AiProvider, string]>
            ).map(([p, label]) => (
              <button
                key={p}
                className={settings.provider === p ? 'active' : ''}
                onClick={() => updateSettings({ provider: p })}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="hint">
            {settings.provider === 'demo' &&
              'Demo mode restyles your photo locally with colour grading — no account or internet needed. Great for trying the app.'}
            {settings.provider === 'claude' &&
              'Claude studies your photo and writes a tailored AI design plan (palette, key changes, materials, furnishings). The visual preview is rendered locally. Requires an Anthropic API key.'}
            {settings.provider === 'gemini' &&
              'Gemini 2.5 Flash Image ("Nano Banana") edits your actual photo into the chosen style, keeping the room’s structure. Requires a Google AI Studio API key (free tier available).'}
          </div>
        </div>
      </div>

      {settings.provider === 'claude' && (
        <>
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Anthropic API key</label>
              <div className="row">
                <input
                  className="input"
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-ant-…"
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
                Stored locally on this device only, and used from the app&apos;s background process —
                never exposed to the page. Get a key at{' '}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
                  console.anthropic.com{' '}
                  <ExternalLink size={11} style={{ verticalAlign: 'middle' }} />
                </a>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Model</label>
              <div className="model-list">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    className={`model-card ${settings.model === m.id ? 'active' : ''}`}
                    onClick={() => updateSettings({ model: m.id })}
                  >
                    <div className="st-name">{m.label}</div>
                    <div className="st-desc">{m.note}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {settings.provider === 'gemini' && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Google (Gemini) API key</label>
            <div className="row">
              <input
                className="input"
                type={showGKey ? 'text' : 'password'}
                placeholder="AIza…"
                value={gKey}
                onChange={(e) => setGKey(e.target.value)}
              />
              <button
                className="btn btn-ghost"
                onClick={() => setShowGKey((v) => !v)}
                title={showGKey ? 'Hide' : 'Show'}
              >
                {showGKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button className="btn btn-primary" onClick={saveGKey}>
                {savedGKey ? <Check size={16} /> : null}
                {savedGKey ? 'Saved' : 'Save'}
              </button>
            </div>
            <div className="hint">
              Free to create. Stored locally on this device only, and used from the app&apos;s
              background process — never exposed to the page. Get a key at{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                aistudio.google.com/apikey{' '}
                <ExternalLink size={11} style={{ verticalAlign: 'middle' }} />
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
