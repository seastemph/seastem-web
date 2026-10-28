import { useId } from 'react'
import styles from './HeroWaves.module.css'

// Each 1440-unit period ends at its starting height with a horizontal tangent.
// Repeating the curve within one path avoids a seam between separate shapes.
const layers = [
  {
    name: 'back',
    start: 200,
    curve: 'c180 0 180 -140 360 -140 s180 140 360 140 s180 80 360 80 s180 -80 360 -80',
    stops: [
      { offset: '0%', color: '#073451' },
      { offset: '42%', color: '#377391' },
      { offset: '78%', color: '#98ccdf' },
      { offset: '100%', color: '#bce2ef' },
    ],
  },
  {
    name: 'middle',
    start: 260,
    curve: 'c180 0 180 -100 360 -100 s180 45 360 45 s180 110 360 110 s180 -55 360 -55',
    stops: [
      { offset: '0%', color: '#fff' },
      { offset: '48%', color: '#f2f8fa' },
      { offset: '100%', color: '#b9dfed' },
    ],
  },
  {
    name: 'front',
    start: 315,
    curve: 'c180 0 180 -65 360 -65 s180 55 360 55 s180 45 360 45 s180 -35 360 -35',
    stops: [
      { offset: '0%', color: '#a5d9ee' },
      { offset: '66%', color: '#bce3f2' },
      { offset: '100%', color: '#e4f3fb' },
    ],
  },
]

export default function HeroWaves({ isRunning }) {
  const instanceId = useId().replace(/:/g, '')

  return (
    <div
      className={styles.stage}
      aria-hidden="true"
      style={{ '--wave-play-state': isRunning ? 'running' : 'paused' }}
    >
      {layers.map(({ name, start, curve, stops }) => {
        const gradientId = `${instanceId}-wave-${name}`
        return (
          <div key={name} className={`${styles.track} ${styles[name]}`} data-wave-layer={name}>
            <svg viewBox="0 0 2880 400" preserveAspectRatio="none" focusable="false">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="40" x2="0" y2="400" gradientUnits="userSpaceOnUse">
                  {stops.map(({ offset, color }) => (
                    <stop key={offset} offset={offset} stopColor={color} />
                  ))}
                </linearGradient>
              </defs>
              <path d={`M0 ${start} ${curve} ${curve} L2880 402 H0 Z`} fill={`url(#${gradientId})`} />
            </svg>
          </div>
        )
      })}
    </div>
  )
}
