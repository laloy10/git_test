import { Download, Images, Trash2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export function GalleryScreen(): JSX.Element {
  const projects = useAppStore((s) => s.projects)
  const deleteProject = useAppStore((s) => s.deleteProject)
  const clearProjects = useAppStore((s) => s.clearProjects)
  const navigate = useAppStore((s) => s.navigate)

  const download = async (dataUrl: string, name: string): Promise<void> => {
    await window.api.saveImage(dataUrl, name)
  }

  if (projects.length === 0) {
    return (
      <div className="content">
        <div className="empty">
          <Images size={48} strokeWidth={1.3} />
          <h3>No saved designs yet</h3>
          <p>Generate a redesign in the Studio and add it to your gallery.</p>
          <button className="btn btn-primary" onClick={() => navigate('studio')}>
            Open Studio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="page-head row between">
        <div>
          <h1 className="page-title">Gallery</h1>
          <p className="page-sub">{projects.length} saved design{projects.length === 1 ? '' : 's'}</p>
        </div>
        <button className="btn btn-ghost" onClick={clearProjects}>
          <Trash2 size={15} /> Clear all
        </button>
      </div>

      <div className="grid cols-3">
        {projects.map((p) => (
          <div key={p.id} className="proj-card">
            <img className="proj-thumb" src={p.afterImage} alt={p.styleName} />
            <div className="proj-meta">
              <div>
                <div className="pm-title">{p.styleName}</div>
                <div className="pm-sub">
                  {p.categoryName} · {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="row" style={{ gap: 2 }}>
                <button
                  className="icon-btn"
                  title="Save PNG"
                  onClick={() => download(p.afterImage, `${p.categoryId}-${p.styleId}.png`)}
                >
                  <Download size={16} />
                </button>
                <button className="icon-btn" title="Delete" onClick={() => deleteProject(p.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
