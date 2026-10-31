import { useEffect, useRef, useState } from 'react'
import conversation from '../../assets/approach/conversation.png'
import internet from '../../assets/approach/internet.png'
import compass from '../../assets/approach/compass.png'
import handshake from '../../assets/approach/handshake.png'
import styles from './OurApproachSection.module.css'

const approaches = [
  {
    id: 'understanding',
    title: 'UNDERSTANDING FIRST',
    description: 'We listen to your goals before recommending solutions.',
    icon: conversation,
    iconSize: 115,
  },
  {
    id: 'connected',
    title: 'CONNECTED SOLUTIONS',
    description: 'Bringing your digital presence together.',
    icon: internet,
    iconSize: 115,
  },
  {
    id: 'guidance',
    title: 'CLEAR GUIDANCE',
    description: 'Understand what you need, why it matters, and what to expect.',
    icon: compass,
    iconSize: 105,
  },
  {
    id: 'support',
    title: 'DEDICATED SUPPORT',
    description: 'Reliable help as your business grows and your needs evolve.',
    icon: handshake,
    iconSize: 105,
  },
]

function needsStaticPresentation() {
  return typeof window === 'undefined'
    || typeof window.IntersectionObserver !== 'function'
    || typeof window.matchMedia !== 'function'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function OurApproachSection() {
  const headingRef = useRef(null)
  const iconRefs = useRef([])
  const startedRef = useRef(new Set())
  const [staticMotion, setStaticMotion] = useState(needsStaticPresentation)
  const [headingRevealed, setHeadingRevealed] = useState(false)
  const [delays, setDelays] = useState({})

  useEffect(() => {
    if (staticMotion) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 1024px)')
    const tablet = window.matchMedia('(min-width: 600px)')
    let rowObserver

    const headingObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
        setHeadingRevealed(true)
        headingObserver.disconnect()
      }
    }, { threshold: 0.25 })
    headingObserver.observe(headingRef.current)

    function observeRows() {
      rowObserver?.disconnect()
      // These match the CSS grid breakpoints. Card keys and captured delays stay
      // unchanged on resize, so moving a card to another row never restarts it.
      const columns = desktop.matches ? 4 : tablet.matches ? 2 : 1
      const rowStarts = new Map()

      rowObserver = new IntersectionObserver((entries, observer) => {
        const newlyStarted = {}

        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue

          const start = rowStarts.get(entry.target)
          for (let offset = 0; offset < columns; offset += 1) {
            const approach = approaches[start + offset]
            if (!approach || startedRef.current.has(approach.id)) continue

            startedRef.current.add(approach.id)
            newlyStarted[approach.id] = offset * 150
          }
          observer.unobserve(entry.target)
        }

        if (Object.keys(newlyStarted).length > 0) {
          setDelays(previous => ({ ...previous, ...newlyStarted }))
        }
      }, { threshold: 0.5, rootMargin: '0px 0px -64px 0px' })

      for (let index = 0; index < approaches.length; index += columns) {
        const row = approaches.slice(index, index + columns)
        if (row.every(approach => startedRef.current.has(approach.id))) continue
        const firstIcon = iconRefs.current[index]
        rowStarts.set(firstIcon, index)
        rowObserver.observe(firstIcon)
      }
    }

    function handleReducedMotion(event) {
      // Once motion is disabled, leave every card settled for this mount.
      if (event.matches) setStaticMotion(true)
    }

    observeRows()
    desktop.addEventListener('change', observeRows)
    tablet.addEventListener('change', observeRows)
    reducedMotion.addEventListener('change', handleReducedMotion)

    return () => {
      headingObserver.disconnect()
      rowObserver?.disconnect()
      desktop.removeEventListener('change', observeRows)
      tablet.removeEventListener('change', observeRows)
      reducedMotion.removeEventListener('change', handleReducedMotion)
    }
  }, [staticMotion])

  return (
    <section
      id="our-approach"
      className={styles.section}
      aria-labelledby="approach-heading"
      data-motion={staticMotion ? 'static' : 'animated'}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-revealed={headingRevealed}>
          <h2 ref={headingRef} id="approach-heading" className={styles.heading}>
            BUILT AROUND YOUR BUSINESS
          </h2>
          <p className={styles.introduction}>
            We start with your needs and bring the right digital solutions together
            to help your business grow.
          </p>
        </header>
        <ul className={styles.grid} role="list">
          {approaches.map((approach, index) => (
            <li
              key={approach.id}
              className={styles.card}
              data-approach={approach.id}
              data-started={delays[approach.id] !== undefined}
              style={{ '--reveal-delay': `${delays[approach.id] ?? 0}ms` }}
            >
              <div
                ref={element => { iconRefs.current[index] = element }}
                className={styles.iconBox}
                aria-hidden="true"
              >
                <img
                  className={styles.icon}
                  src={approach.icon}
                  width={approach.iconSize}
                  height={approach.iconSize}
                  alt=""
                  draggable="false"
                />
              </div>
              <div className={styles.cardText}>
                <h3 className={styles.title}>{approach.title}</h3>
                <p className={styles.description}>{approach.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
