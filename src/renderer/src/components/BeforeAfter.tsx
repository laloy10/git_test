import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'

interface Props {
  before: string
  after: string
}

/** Draggable before/after comparison slider. */
export function BeforeAfter({ before, after }: Props): JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent): void => {
      if (dragging.current) move(e.clientX)
    }
    const onUp = (): void => {
      dragging.current = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [move])

  return (
    <div
      className="ba-wrap"
      ref={wrapRef}
      onMouseDown={(e) => {
        dragging.current = true
        move(e.clientX)
      }}
    >
      <img className="ba-img" src={before} alt="Before" draggable={false} />
      {/* After image sits on top, revealed left-to-right via clip-path. */}
      <img
        className="ba-img"
        src={after}
        alt="After"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <div className="ba-tag before">BEFORE</div>
      <div className="ba-tag after">AFTER</div>

      <div className="ba-handle" style={{ left: `${pos}%` }}>
        <div className="ba-knob">
          <ChevronsLeftRight size={18} />
        </div>
      </div>
    </div>
  )
}
