import { Sparkles } from 'lucide-react'
import type { DesignRecommendation } from '../../../shared/types'

function List({ title, items }: { title: string; items: string[] }): JSX.Element | null {
  if (!items?.length) return null
  return (
    <div className="plan-block">
      <h5>{title}</h5>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  )
}

/** Renders Claude's structured redesign concept. */
export function DesignPlan({ plan }: { plan: DesignRecommendation }): JSX.Element {
  return (
    <div className="plan">
      <div className="plan-head">
        <span className="badge">
          <Sparkles size={13} /> AI design plan by Claude
        </span>
        <h3>{plan.title}</h3>
        <p>{plan.overview}</p>
      </div>

      {plan.palette?.length > 0 && (
        <div className="plan-block">
          <h5>Colour palette</h5>
          <div className="palette">
            {plan.palette.map((c, i) => (
              <div key={i} className="palette-chip" title={`${c.name} · ${c.use}`}>
                <span className="palette-swatch" style={{ background: c.hex }} />
                <span className="palette-name">{c.name}</span>
                <span className="palette-hex">{c.hex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <List title="Key changes" items={plan.keyChanges} />
      <List title="Materials & finishes" items={plan.materials} />
      <List title="Furnishings & decor" items={plan.furnishings} />

      {plan.budgetTip && (
        <div className="plan-block plan-tip">
          <h5>Budget tip</h5>
          <p>{plan.budgetTip}</p>
        </div>
      )}
    </div>
  )
}
