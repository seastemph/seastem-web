import { useId } from 'react'
import styles from './PackageWaves.module.css'

// The paths extend beyond the viewBox so each ribbon can move independently
// without exposing a hard edge along the panel's cropped right and bottom sides.
const ribbons = [
  {
    name: 'rear',
    path: 'M438 -90 C400 -5 278 67 225 159 C171 253 177 322 225 382 C307 484 459 560 704 642 L704 96 C630 154 553 174 516 133 C480 94 503 51 483 -8 C477 -35 458 -71 438 -90 Z',
    gradient: { x1: 205, y1: 75, x2: 610, y2: 405 },
    stops: [
      { offset: '0%', color: '#06324d' },
      { offset: '25%', color: '#245d7c' },
      { offset: '62%', color: '#83b8cf' },
      { offset: '100%', color: '#b9e2f0' },
    ],
  },
  {
    name: 'cyan',
    path: 'M704 112 C640 147 597 185 536 211 C465 243 432 235 381 214 C338 195 305 211 269 236 C194 285 108 336 74 408 C19 524 119 631 292 728 L704 760 Z',
    gradient: { x1: 145, y1: 235, x2: 665, y2: 615 },
    stops: [
      { offset: '0%', color: '#73aec9' },
      { offset: '34%', color: '#a7d8eb' },
      { offset: '72%', color: '#bde6f5' },
      { offset: '100%', color: '#e3f3f9' },
    ],
  },
  {
    name: 'fold',
    path: 'M294 215 C335 187 376 242 411 247 C468 254 580 174 704 104 L704 798 L210 798 C91 688 32 593 48 503 C58 412 128 352 198 300 C243 266 264 236 294 215 Z',
    gradient: { x1: 65, y1: 300, x2: 600, y2: 635 },
    stops: [
      { offset: '0%', color: '#ffffff' },
      { offset: '21%', color: '#f2f8fb' },
      { offset: '49%', color: '#d2edf7' },
      { offset: '77%', color: '#c2e6f3' },
      { offset: '100%', color: '#ffffff' },
    ],
  },
  {
    name: 'foreground',
    path: 'M704 178 C649 242 577 280 493 318 C392 361 282 421 217 481 C134 559 149 639 253 716 C298 748 355 776 405 798 L704 798 L704 699 C495 626 485 565 704 470 Z',
    gradient: { x1: 225, y1: 370, x2: 650, y2: 735 },
    stops: [
      { offset: '0%', color: '#bce7f7' },
      { offset: '31%', color: '#a9dcf0' },
      { offset: '63%', color: '#c9ebf7' },
      { offset: '100%', color: '#eff9fc' },
    ],
  },
]

export default function PackageWaves({ isRunning = true }) {
  const instanceId = useId().replace(/:/g, '')

  return (
    <div
      className={styles.stage}
      aria-hidden="true"
      style={{ '--package-wave-play-state': isRunning ? 'running' : 'paused' }}
    >
      <svg
        className={styles.artwork}
        viewBox="0 0 600 640"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          {ribbons.map(({ name, gradient, stops }) => (
            <linearGradient
              key={name}
              id={`${instanceId}-package-${name}`}
              {...gradient}
              gradientUnits="userSpaceOnUse"
            >
              {stops.map(({ offset, color }) => (
                <stop key={offset} offset={offset} stopColor={color} />
              ))}
            </linearGradient>
          ))}
        </defs>
        {ribbons.map(({ name, path }) => (
          <g
            key={name}
            className={`${styles.ribbon} ${styles[name]}`}
            data-package-wave-layer={name}
          >
            <path d={path} fill={`url(#${instanceId}-package-${name})`} />
          </g>
        ))}
      </svg>
    </div>
  )
}
