import { useId } from 'react'
import styles from './SectionWaves.module.css'

// The curves extend 320 units beyond each side and below the stage so the
// layered motion never reveals a straight edge inside the artwork.
const layers = [
  {
    name: 'crest',
    path: 'M-320 172 C-160 168 206 210 305 206 C455 196 559 112 724 79 C905 41 1023 52 1185 76 C1341 100 1590 94 1760 82 L1760 2400 H-320 Z',
    gradient: { x1: 0, y1: 48, x2: 0, y2: 328 },
    stops: [
      { offset: '0%', color: '#fbfcfc' },
      { offset: '30%', color: '#eaf2f6' },
      { offset: '66%', color: '#cae6f2' },
      { offset: '100%', color: '#a6d7ec' },
    ],
  },
  {
    name: 'navy',
    path: 'M-320 269 C-160 294 146 328 192 322 C360 324 495 226 647 209 C822 184 982 259 1129 265 C1297 271 1590 228 1760 251 L1760 2400 H-320 Z',
    gradient: { x1: 0, y1: 201, x2: 0, y2: 358 },
    stops: [
      { offset: '0%', color: '#052f4a' },
      { offset: '34%', color: '#225674' },
      { offset: '70%', color: '#6da3bd' },
      { offset: '100%', color: '#badfeb' },
    ],
  },
  {
    name: 'front',
    path: 'M-320 284 C-160 296 156 342 198 334 C365 334 523 267 667 243 C841 212 1011 296 1211 301 C1350 303 1590 270 1760 286 L1760 2400 H-320 Z',
    gradient: { x1: 0, y1: 235, x2: 0, y2: 384 },
    stops: [
      { offset: '0%', color: '#bce5f4' },
      { offset: '36%', color: '#9dcbdf' },
      { offset: '73%', color: '#80aec5' },
      { offset: '100%', color: '#b8deed' },
    ],
  },
  {
    name: 'accent',
    path: 'M-320 367 C-160 409 359 385 553 327 C698 281 778 293 934 338 C1117 385 1590 380 1760 340 L1760 2400 H-320 Z',
    gradient: { x1: 0, y1: 300, x2: 0, y2: 410 },
    stops: [
      { offset: '0%', color: '#073451' },
      { offset: '35%', color: '#28627f' },
      { offset: '75%', color: '#78b0c9' },
      { offset: '100%', color: '#c2e6f3' },
    ],
  },
]

export default function SectionWaves({ isRunning = false }) {
  const instanceId = useId().replace(/:/g, '')

  return (
    <div className={styles.stage} aria-hidden="true" style={{ '--wave-play-state': isRunning ? 'running' : 'paused' }}>
      <svg
        className={styles.artwork}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          {layers.map(({ name, gradient, stops }) => (
            <linearGradient
              key={name}
              id={`${instanceId}-section-wave-${name}`}
              {...gradient}
              gradientUnits="userSpaceOnUse"
            >
              {stops.map(({ offset, color }) => (
                <stop key={offset} offset={offset} stopColor={color} />
              ))}
            </linearGradient>
          ))}
        </defs>
        {layers.map(({ name, path }) => (
          <g key={name} className={`${styles.layer} ${styles[name]}`} data-section-wave-layer={name}>
            <path d={path} fill={`url(#${instanceId}-section-wave-${name})`} />
          </g>
        ))}
      </svg>
    </div>
  )
}
