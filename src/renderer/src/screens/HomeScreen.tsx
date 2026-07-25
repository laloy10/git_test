import { ArrowRight, Sparkles } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { useAppStore } from '../store/useAppStore'
import { CategoryIcon } from '../components/CategoryIcon'

export function HomeScreen(): JSX.Element {
  const openCategory = useAppStore((s) => s.openCategory)
  const projects = useAppStore((s) => s.projects)
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="content">
      <div className="hero">
        <span className="badge" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
          <Sparkles size={13} /> AI-powered redesign
        </span>
        <h1 style={{ marginTop: 14 }}>Reimagine any space in seconds</h1>
        <p>
          Upload a photo of your room, garden or home exterior, choose a style, and preview a
          beautiful redesign — all on your desktop.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <b>4</b>
            <span>Space types</span>
          </div>
          <div className="hero-stat">
            <b>24</b>
            <span>Curated styles</span>
          </div>
          <div className="hero-stat">
            <b>1-tap</b>
            <span>Generation</span>
          </div>
        </div>
      </div>

      <div className="section-label">Choose what to redesign</div>
      <div className="grid cols-4">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} className="cat-card" onClick={() => openCategory(cat.id)}>
            <div className="cat-icon" style={{ background: cat.accent }}>
              <CategoryIcon name={cat.icon} />
            </div>
            <div>
              <h3>{cat.name}</h3>
              <p>{cat.tagline}</p>
            </div>
            <div className="cat-count">{cat.styles.length} styles →</div>
          </button>
        ))}
      </div>

      {projects.length > 0 && (
        <>
          <div className="row between mt-24" style={{ marginBottom: 14 }}>
            <div className="section-label" style={{ margin: 0 }}>
              Recent designs
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('gallery')}>
              View all <ArrowRight size={15} />
            </button>
          </div>
          <div className="grid cols-4">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="proj-card">
                <img className="proj-thumb" src={p.afterImage} alt={p.styleName} />
                <div className="proj-meta">
                  <div>
                    <div className="pm-title">{p.styleName}</div>
                    <div className="pm-sub">{p.categoryName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
