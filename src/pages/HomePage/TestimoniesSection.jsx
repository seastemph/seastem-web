import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import styles from './TestimoniesSection.module.css'

const lanes = [
  { name: 'top', direction: 'rtl', cards: ['sample-one', 'sample-two'] },
  { name: 'bottom', direction: 'ltr', cards: ['sample-three', 'sample-four'] },
]

function TestimonialCard({ id, instance, isClone, cardRef, expanded, onHover, onLeave, onToggle }) {
  const elementRef = useRef(null)
  const viewportRef = useRef(null)
  const textRef = useRef(null)
  const quoteId = useId()
  const [size, setSize] = useState({ preview: 49, expanded: 49, overflowing: false, scrollable: false, disclosure: false })

  useLayoutEffect(() => {
    let disposed = false
    function measure() {
      const card = elementRef.current
      const viewport = viewportRef.current
      const text = textRef.current
      if (!card || !viewport || !text || card.getBoundingClientRect().width === 0) return
      const preview = parseFloat(getComputedStyle(text).lineHeight) * 2
      const naturalHeight = text.scrollHeight
      const tokens = getComputedStyle(document.documentElement)
      const rootSize = parseFloat(tokens.fontSize)
      const navbarSpace = (parseFloat(tokens.getPropertyValue('--header-compact-top')) || 10)
        + (parseFloat(tokens.getPropertyValue('--header-compact-height')) || 68) + 48
      // Only the quote scrolls; enlarged labels and controls may exceed the cap.
      const chrome = card.getBoundingClientRect().height - viewport.getBoundingClientRect().height
      const cap = Math.min(rootSize * 22, window.innerHeight - navbarSpace)
      const expandedHeight = Math.min(naturalHeight, Math.max(preview, cap - chrome))
      setSize(previous => {
        const next = {
          preview: Math.min(preview, naturalHeight), expanded: expandedHeight,
          overflowing: naturalHeight > preview + 1, scrollable: naturalHeight > expandedHeight + 1,
          // Keep an existing disclosure mounted when keyboard reading or resizing
          // widens a card, so a focused control cannot disappear mid-interaction.
          disclosure: previous.disclosure || naturalHeight > preview + 1,
        }
        return Object.keys(next).every(key => previous[key] === next[key]) ? previous : next
      })
    }
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    observer?.observe(elementRef.current)
    observer?.observe(textRef.current)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(() => { if (!disposed) measure() })
    measure()
    return () => { disposed = true; observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  useEffect(() => {
    if (!expanded && viewportRef.current) viewportRef.current.scrollTop = 0
  }, [expanded])

  const isExpanded = expanded
  const controlLabel = isExpanded ? 'Read less' : 'Read more'
  return (
    <li
      ref={element => { elementRef.current = element; cardRef?.(element) }}
      className={styles.card}
      data-testimonial-original={isClone ? undefined : id}
      data-testimonial-clone={isClone ? id : undefined}
      data-testimonial-instance={instance}
      data-expanded={isExpanded}
      data-overflowing={size.overflowing}
      aria-hidden={isClone ? true : undefined}
      style={{ '--quote-preview-height': `${size.preview}px`, '--quote-expanded-height': `${size.expanded}px` }}
      onPointerEnter={event => {
        if (event.pointerType === 'mouse' && window.matchMedia?.('(hover: hover)').matches && size.overflowing) onHover(instance)
      }}
      onPointerLeave={event => {
        if (!event.currentTarget.contains(document.activeElement) || !document.activeElement.matches(':focus-visible')) onLeave(instance)
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) onLeave(instance)
      }}
    >
      <figure className={styles.testimonial}>
        <p className={styles.sampleLabel}>Sample testimonial</p>
        <blockquote className={styles.quote}>
          <div
            ref={viewportRef}
            id={isClone ? undefined : quoteId}
            className={styles.quoteViewport}
            data-scrollable={isExpanded && size.scrollable}
            tabIndex={isClone ? -1 : isExpanded && size.scrollable ? 0 : undefined}
            onMouseDown={isClone ? event => event.preventDefault() : undefined}
            role={!isClone && isExpanded && size.scrollable ? 'region' : undefined}
            aria-label={!isClone && isExpanded && size.scrollable ? 'Full sample testimonial' : undefined}
          >
            <p ref={textRef}>
              This is sample content for layout preview. An approved client quote
              will appear here.
            </p>
          </div>
        </blockquote>
        <figcaption className={styles.credit}>Client name · Company / role</figcaption>
      </figure>
      {size.disclosure && (isClone ? (
        // Copies offer pointer interaction without duplicate keyboard controls.
        <span className={styles.disclosure} onClick={() => onToggle(id, instance, isExpanded)}>{controlLabel}</span>
      ) : (
        <button type="button" className={styles.disclosure} aria-expanded={isExpanded} aria-controls={quoteId}
          onClick={() => onToggle(id, instance, isExpanded)}>{controlLabel}</button>
      ))}
    </li>
  )
}

export default function TestimoniesSection({ isRunning = true, isStatic = false, onReadingModeChange }) {
  const laneRef = useRef(null)
  const firstCardRef = useRef(null)
  const firstGroupRef = useRef(null)
  const [readingMode, setReadingMode] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [opened, setOpened] = useState(null)
  const [measurement, setMeasurement] = useState({ repeatCount: 1, distance: 760, duration: 760 / 28, ready: false })
  const canMeasure = typeof ResizeObserver === 'function'
  const staticPresentation = isStatic || !canMeasure
  const showAll = staticPresentation || readingMode || Boolean(opened?.reading)

  useEffect(() => {
    if (showAll || !canMeasure) return
    function measure() {
      const viewportWidth = laneRef.current.getBoundingClientRect().width
      const cardWidth = firstCardRef.current.getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(firstGroupRef.current).columnGap) || 20
      const pairWidth = (cardWidth + gap) * lanes[0].cards.length
      if (viewportWidth <= 0 || pairWidth <= 0) return
      // Preserve an explicitly opened visual copy through viewport changes.
      const retainedRepetition = opened ? Number(opened.instance.split(':')[1]) + 1 : 1
      const repeatCount = Math.max(retainedRepetition, Math.ceil((viewportWidth + 1) / pairWidth))
      const distance = repeatCount * pairWidth
      const duration = distance / (window.innerWidth < 600 ? 18 : 28)
      setMeasurement(previous => previous.repeatCount === repeatCount && previous.distance === distance
        && previous.duration === duration && previous.ready ? previous : { repeatCount, distance, duration, ready: true })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(laneRef.current)
    observer.observe(firstCardRef.current)
    measure()
    return () => observer.disconnect()
  }, [showAll, canMeasure, opened])

  function changeReadingMode(next) {
    if (next === readingMode) return
    if (next && hovered && !opened) {
      setOpened({ id: hovered.split(':')[2], instance: hovered, reading: true })
    } else if (next && opened && !opened.reading) {
      setOpened({ ...opened, reading: true })
    }
    setReadingMode(next)
    setHovered(null)
    onReadingModeChange?.(next)
  }
  function toggle(id, instance, expanded) {
    if (expanded && opened?.reading) setReadingMode(true)
    setOpened(expanded ? null : { id, instance, reading: showAll })
    setHovered(null)
  }
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      if (event.target.matches('[data-scrollable]')) {
        event.target.closest('[data-testimonial-original]')?.querySelector('button')?.focus({ preventScroll: true })
      }
      if (opened?.reading) setReadingMode(true)
      setOpened(null)
      setHovered(null)
    }
    else if (['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown'].includes(event.key) && !staticPresentation) changeReadingMode(true)
  }

  return (
    <section
      id="testimonies"
      className={styles.section}
      aria-labelledby="testimonies-heading"
      data-reading={showAll}
      data-static={staticPresentation}
      data-ready={measurement.ready}
      onFocusCapture={event => {
        if (!staticPresentation && event.target.matches(':focus-visible')) changeReadingMode(true)
      }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) changeReadingMode(false)
      }}
      onKeyDownCapture={handleKeyDown}
      tabIndex={staticPresentation ? undefined : 0}
      style={{
        '--testimonial-duration': `${measurement.duration}s`,
        '--testimonial-play-state': isRunning && !opened && !hovered && !readingMode ? 'running' : 'paused',
      }}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <p className={styles.eyebrow}>REAL EXPERIENCES. SHARED SUCCESS.</p>
          <h2 id="testimonies-heading" className={styles.heading}>THE CLIENTS BEHIND THE WAVES</h2>
        </header>
      </div>
      <div id="testimonial-lanes" className={styles.lanes}>
        {lanes.map((lane, laneIndex) => (
          <div key={lane.name} ref={laneIndex === 0 ? laneRef : undefined} className={styles.lane}
            data-testimonial-lane={lane.name} data-reveal>
            <div className={`${styles.track} ${lane.direction === 'ltr' ? styles.reverse : ''}`} data-testimonial-track={lane.direction}>
              {[false, true].map(cloneGroup => (
                <ul
                  key={cloneGroup ? 'copy' : 'original'}
                  ref={!cloneGroup && laneIndex === 0 ? firstGroupRef : undefined}
                  className={`${styles.group} ${cloneGroup ? styles.duplicateGroup : ''}`}
                  role="list"
                  aria-label={cloneGroup ? undefined : `${laneIndex === 0 ? 'First' : 'Second'} sample testimonial group`}
                  aria-hidden={cloneGroup ? true : undefined}
                >
                  {Array.from({ length: measurement.repeatCount }, (_, repetition) => lane.cards.map((id, cardIndex) => {
                    const isClone = cloneGroup || repetition > 0
                    const instance = `${cloneGroup ? 'copy' : 'original'}:${repetition}:${id}`
                    const expanded = opened ? showAll ? !isClone && opened.id === id : opened.instance === instance : hovered === instance
                    return (
                      <TestimonialCard
                        key={`${repetition}-${id}`} id={id} instance={instance} isClone={isClone} expanded={expanded}
                        onHover={key => { if (!opened) setHovered(key) }}
                        onLeave={key => setHovered(current => current === key ? null : current)}
                        onToggle={toggle}
                        cardRef={!cloneGroup && repetition === 0 && laneIndex === 0 && cardIndex === 0
                          ? element => { firstCardRef.current = element } : undefined}
                      />
                    )
                  }))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
