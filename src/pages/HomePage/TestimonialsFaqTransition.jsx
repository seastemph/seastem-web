import { useEffect, useRef, useState } from 'react'
import TestimoniesSection from './TestimoniesSection.jsx'
import FAQsSection from './FAQsSection.jsx'
import SectionWaves from './SectionWaves.jsx'
import styles from './TestimonialsFaqTransition.module.css'

const needsStaticPresentation = () => typeof window === 'undefined'
  || typeof IntersectionObserver !== 'function'
  || typeof ResizeObserver !== 'function'
  || typeof window.matchMedia !== 'function'
  || window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Observation controls fades and autoplay, never geometry or scroll position.
export default function TestimonialsFaqTransition() {
  const rootRef = useRef(null)
  const waveRef = useRef(null)
  const [motion, setMotion] = useState(() => ({
    lanes: false, waves: false, static: needsStaticPresentation(),
  }))

  useEffect(() => {
    const root = rootRef.current
    const targets = [...root.querySelectorAll('[data-reveal]')]
    if (typeof IntersectionObserver !== 'function'
      || typeof ResizeObserver !== 'function'
      || typeof window.matchMedia !== 'function') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const visibleLanes = new Set()
    let wavesVisible = false
    const reveal = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.dataset.revealed = 'true'
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0 })

    function updateMotion() {
      if (reduced.matches) {
        for (const target of targets) {
          target.dataset.revealed = 'true'
          reveal.unobserve(target)
        }
      }
      const running = !document.hidden && !reduced.matches
      const next = {
        lanes: running && visibleLanes.size > 0,
        waves: running && wavesVisible,
        static: reduced.matches,
      }
      setMotion(previous => Object.keys(next).every(key => next[key] === previous[key])
        ? previous : next)
    }

    const visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === waveRef.current) wavesVisible = entry.isIntersecting
        else if (entry.isIntersecting) visibleLanes.add(entry.target)
        else visibleLanes.delete(entry.target)
      }
      updateMotion()
    })

    targets.forEach(target => reveal.observe(target))
    root.querySelectorAll('[data-testimonial-lane]').forEach(lane => visibility.observe(lane))
    visibility.observe(waveRef.current)
    reduced.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateMotion)
    updateMotion()

    return () => {
      reveal.disconnect()
      visibility.disconnect()
      reduced.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateMotion)
    }
  }, [])

  function revealFocusedContent(event) {
    const section = event.target.closest('section')
    section?.querySelectorAll('[data-reveal]').forEach(element => {
      element.dataset.revealed = 'true'
      element.dataset.focusRevealed = 'true'
    })
  }

  return (
    <div ref={rootRef} className={styles.root} data-testimonials-faq
      data-motion={motion.static ? 'static' : 'animated'} onFocusCapture={revealFocusedContent}>
      <TestimoniesSection isRunning={motion.lanes} isStatic={motion.static} />
      <div className={styles.faq}>
        <FAQsSection />
        <div ref={waveRef} className={styles.waves} aria-hidden="true" data-faq-waves>
          <SectionWaves isRunning={motion.waves} />
        </div>
      </div>
    </div>
  )
}
