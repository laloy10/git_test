import { Check, Download, RefreshCw, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getCategory } from '../data/categories'
import { useAppStore } from '../store/useAppStore'
import { BeforeAfter } from '../components/BeforeAfter'
import { UploadZone } from '../components/UploadZone'
import { CategoryIcon } from '../components/CategoryIcon'

export function StudioScreen(): JSX.Element {
  const {
    categoryId,
    sourceImage,
    resultImage,
    selectedStyle,
    generating,
    error,
    setSourceImage,
    selectStyle,
    generate,
    resetStudio,
    saveCurrentToGallery
  } = useAppStore()

  const [saved, setSaved] = useState(false)
  const category = getCategory(categoryId)
  if (!category) return <div className="content">Unknown category.</div>

  const onSave = async (): Promise<void> => {
    await saveCurrentToGallery()
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const onDownload = async (): Promise<void> => {
    if (!resultImage) return
    await window.api.saveImage(resultImage, `${category.id}-${selectedStyle?.id ?? 'design'}.png`)
  }

  return (
    <div className="content">
      <div className="page-head row between">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <div
              className="cat-icon"
              style={{ background: category.accent, width: 36, height: 36, borderRadius: 10 }}
            >
              <CategoryIcon name={category.icon} size={18} />
            </div>
            <h1 className="page-title">{category.name}</h1>
          </div>
          <p className="page-sub">{category.tagline} — upload a photo and pick a style.</p>
        </div>
        {sourceImage && (
          <button className="btn btn-ghost" onClick={resetStudio}>
            <Trash2 size={15} /> Start over
          </button>
        )}
      </div>

      <div className="studio">
        <div className="stage">
          {!sourceImage && <UploadZone onImage={setSourceImage} />}

          {sourceImage && generating && (
            <div className="stage-overlay">
              <div className="spinner" />
              <div>
                <strong>Redesigning your {category.name.toLowerCase()}…</strong>
                <div style={{ fontSize: 13 }}>Applying the {selectedStyle?.name} style</div>
              </div>
            </div>
          )}

          {sourceImage && !generating && resultImage && (
            <BeforeAfter before={sourceImage} after={resultImage} />
          )}

          {sourceImage && !generating && !resultImage && (
            <div className="ba-wrap">
              <img className="ba-img" src={sourceImage} alt="Source" />
              <div className="ba-tag before">BEFORE</div>
            </div>
          )}

          {resultImage && !generating && (
            <div className="row mt-16" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={onDownload}>
                <Download size={15} /> Save PNG
              </button>
              <button className="btn btn-ghost" onClick={onSave}>
                {saved ? <Check size={15} /> : null}
                {saved ? 'Saved' : 'Add to gallery'}
              </button>
              <button className="btn btn-primary" onClick={generate}>
                <RefreshCw size={15} /> Regenerate
              </button>
            </div>
          )}

          {error && <div className="alert">{error}</div>}
        </div>

        <div className="panel">
          <h4>Choose a style</h4>
          <div className="style-list">
            {category.styles.map((style) => (
              <button
                key={style.id}
                className={`style-card ${selectedStyle?.id === style.id ? 'active' : ''}`}
                onClick={() => selectStyle(style)}
              >
                <div
                  className="style-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${style.swatch[0]}, ${style.swatch[1]})`
                  }}
                />
                <div>
                  <div className="st-name">{style.name}</div>
                  <div className="st-desc">{style.description}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary btn-block mt-16"
            disabled={!sourceImage || !selectedStyle || generating}
            onClick={generate}
          >
            <Sparkles size={16} />
            {generating ? 'Generating…' : 'Generate design'}
          </button>
        </div>
      </div>
    </div>
  )
}
