import { useId } from 'react'
import styles from './HeroWaves.module.css'

// Each 1440-unit period starts and finishes at the same height and slope.
// Two periods in one filled path keep the rolling ribbon seamless at the loop.
const layers = [
  {
    name: 'back',
    start: 170,
    curve: 'c120 -80 240 -126 360 -126 c120 0 240 46 360 126 c120 80 240 100 360 100 c120 0 240 -20 360 -100',
    stops: [
      { offset: '0%', color: '#073451' },
      { offset: '42%', color: '#377391' },
      { offset: '78%', color: '#98ccdf' },
      { offset: '100%', color: '#bce2ef' },
    ],
  },
  {
    name: 'white',
    start: 245,
    curve: 'c120 -78 240 -121 360 -121 c120 0 240 43 360 121 c120 78 240 93 360 93 c120 0 240 -15 360 -93',
    stops: [
      { offset: '0%', color: '#fff' },
      { offset: '55%', color: '#f4f9fb' },
      { offset: '100%', color: '#c4e4f0' },
    ],
  },
  {
    name: 'cyan',
    start: 275,
    curve: 'c120 -65 240 -95 360 -95 c120 0 240 30 360 95 c120 65 240 90 360 90 c120 0 240 -25 360 -90',
    stops: [
      { offset: '0%', color: '#9ed4e9' },
      { offset: '58%', color: '#b1dff0' },
      { offset: '100%', color: '#d1ebf6' },
    ],
  },
  {
    name: 'front',
    start: 330,
    curve: 'c120 -50 240 -84 360 -84 c120 0 240 34 360 84 c120 50 240 56 360 56 c120 0 240 -6 360 -56',
    stops: [
      { offset: '0%', color: '#c1e4f2' },
      { offset: '60%', color: '#d9eef8' },
      { offset: '100%', color: '#e7f4fb' },
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
