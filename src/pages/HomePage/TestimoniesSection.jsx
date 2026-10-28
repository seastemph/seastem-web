import { useEffect, useRef, useState } from 'react'
import styles from './TestimoniesSection.module.css'

const lanes = [
  { name: 'top', direction: 'rtl', cards: ['sample-one', 'sample-two'] },
  { name: 'bottom', direction: 'ltr', cards: ['sample-three', 'sample-four'] },
]

function TestimonialCard({ id, isClone, cardRef }) {
  return (
    <li
      ref={cardRef}
      className={styles.card}
      data-testimonial-original={isClone ? undefined : id}
      data-testimonial-clone={isClone ? id : undefined}
      aria-hidden={isClone ? true : undefined}
    >
      <figure className={styles.testimonial}>
        <p className={styles.sampleLabel}>Sample testimonial</p>
        <blockquote className={styles.quote}>
          <p>
            This is sample content for layout preview. An approved client quote
            will appear here.
          </p>
        </blockquote>
        <figcaption className={styles.credit}>
          Client name · Company / role
        </figcaption>
      </figure>
    </li>
  )
}

export default function TestimoniesSection({
  isRunning = true,
  isStatic = false,
  onReadingModeChange,
}) {
  const laneRef = useRef(null)
  const firstCardRef = useRef(null)
  const firstGroupRef = useRef(null)
  const [readingMode, setReadingMode] = useState(false)
  const [measurement, setMeasurement] = useState({
    repeatCount: 1,
    distance: 760,
    duration: 760 / 28,
    ready: false,
  })
  const canMeasure = typeof ResizeObserver === 'function'
  const staticPresentation = isStatic || !canMeasure
  const showAll = staticPresentation || readingMode

  useEffect(() => {
    if (showAll || !canMeasure) return

    function measure() {
      const viewportWidth = laneRef.current.getBoundingClientRect().width
      const cardWidth = firstCardRef.current.getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(firstGroupRef.current).columnGap) || 20
      const pairWidth = (cardWidth + gap) * lanes[0].cards.length
      if (viewportWidth <= 0 || pairWidth <= 0) return

      // Each identical group includes its trailing gap and is at least as wide
      // as the viewport, so translating half the track never exposes an edge.
      const repeatCount = Math.max(1, Math.ceil((viewportWidth + 1) / pairWidth))
      const distance = repeatCount * pairWidth
      const speed = window.innerWidth < 600 ? 18 : 28
      const duration = distance / speed

      setMeasurement(previous => (
        previous.repeatCount === repeatCount
          && previous.distance === distance
          && previous.duration === duration
          && previous.ready
          ? previous
          : { repeatCount, distance, duration, ready: true }
      ))
    }

    const observer = new ResizeObserver(measure)
    observer.observe(laneRef.current)
    observer.observe(firstCardRef.current)
    measure()

    return () => observer.disconnect()
  }, [showAll, canMeasure])

  function changeReadingMode(next) {
    if (next === readingMode) return
    setReadingMode(next)
    onReadingModeChange?.(next)
  }

  function handleFocusCapture(event) {
    if (!staticPresentation && event.target.matches(':focus-visible')) {
      changeReadingMode(true)
    }
  }

  function handleBlurCapture(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) changeReadingMode(false)
  }

  return (
    <section
      id="testimonies"
      className={styles.section}
      aria-labelledby="testimonies-heading"
      data-reading={showAll}
      data-static={staticPresentation}
      data-ready={measurement.ready}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      tabIndex={staticPresentation ? undefined : 0}
      style={{
        '--testimonial-duration': `${measurement.duration}s`,
        '--testimonial-play-state': isRunning ? 'running' : 'paused',
      }}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>REAL EXPERIENCES. SHARED SUCCESS.</p>
          <h2 id="testimonies-heading" className={styles.heading}>
            THE CLIENTS BEHIND THE WAVES
          </h2>
        </header>

      </div>

      <div id="testimonial-lanes" className={styles.lanes}>
        {lanes.map((lane, laneIndex) => (
          <div
            key={lane.name}
            ref={laneIndex === 0 ? laneRef : undefined}
            className={styles.lane}
            data-testimonial-lane={lane.name}
          >
            <div
              className={`${styles.track} ${lane.direction === 'ltr' ? styles.reverse : ''}`}
              data-testimonial-track={lane.direction}
            >
              {[false, true].map((cloneGroup) => (
                <ul
                  key={cloneGroup ? 'copy' : 'original'}
                  ref={!cloneGroup && laneIndex === 0 ? firstGroupRef : undefined}
                  className={`${styles.group} ${cloneGroup ? styles.duplicateGroup : ''}`}
                  role="list"
                  aria-label={cloneGroup ? undefined : `${lane.name === 'top' ? 'First' : 'Second'} sample testimonial group`}
                  aria-hidden={cloneGroup ? true : undefined}
                >
                  {Array.from({ length: measurement.repeatCount }, (_, repetition) => (
                    lane.cards.map((id, cardIndex) => (
                      <TestimonialCard
                        key={`${repetition}-${id}`}
                        id={id}
                        isClone={cloneGroup || repetition > 0}
                        cardRef={!cloneGroup && repetition === 0 && laneIndex === 0 && cardIndex === 0 ? firstCardRef : undefined}
                      />
                    ))
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
