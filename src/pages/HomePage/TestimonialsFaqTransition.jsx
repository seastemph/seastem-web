import { useCallback, useEffect, useRef, useState } from 'react'
import TestimoniesSection from './TestimoniesSection.jsx'
import FAQsSection from './FAQsSection.jsx'
import SectionWaves from './SectionWaves.jsx'
import styles from './TestimonialsFaqTransition.module.css'

const clamp = value => Math.min(1, Math.max(0, value))
const ease = value => {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}
const needsStaticPresentation = () => typeof window === 'undefined'
  || typeof IntersectionObserver !== 'function'
  || typeof ResizeObserver !== 'function'
  || typeof window.matchMedia !== 'function'
  || window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function TestimonialsFaqTransition() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const testimonyRef = useRef(null)
  const faqRef = useRef(null)
  const controllerRef = useRef(null)
  const readingRef = useRef(false)
  const [motion, setMotion] = useState(() => ({
    lanes: false, waves: false, static: needsStaticPresentation(),
  }))

  const handleReadingMode = useCallback((reading) => {
    readingRef.current = reading
    if (reading) controllerRef.current?.release(document.activeElement, true)
    controllerRef.current?.schedule(true)
  }, [])

  function handleFocus(event) {
    if (event.target.matches(':focus-visible')) controllerRef.current?.release(event.target, true)
  }

  function handleKeyDown(event) {
    // Pointer focus can become keyboard focus after the reader has scrolled.
    if (['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      controllerRef.current?.release(event.target, true)
    }
  }

  function handleBlur() {
    controllerRef.current?.schedule(true)
  }

  useEffect(() => {
    const root = rootRef.current
    const testimony = testimonyRef.current
    const faq = faqRef.current
    if (typeof IntersectionObserver !== 'function'
      || typeof ResizeObserver !== 'function'
      || typeof window.matchMedia !== 'function') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 1200px)')
    let frame = 0
    let needsMeasurement = true
    let nearViewport = false
    let keyboardReading = false
    let disposed = false
    let lastMotion = null
    let viewportSnapshot = null
    let geometry = { sticky: false, start: 0, span: 1, top: 153, height: 0, testimonyTop: 24, faqTop: 24 }

    function variable(name, value) { root.style.setProperty(name, value) }

    function release(anchor, focusRequested = false) {
      keyboardReading ||= focusRequested
      root.dataset.flowSettled = 'true'
      testimony.dataset.revealed = 'true'
      faq.dataset.revealed = 'true'
      if (!geometry.sticky) {
        schedule(true)
        return
      }

      // Change layout on the same nodes, keeping the reader's control in view.
      const bounds = root.getBoundingClientRect()
      const anchorBounds = anchor && root.contains(anchor) ? anchor.getBoundingClientRect() : null
      const preservePosition = focusRequested || (bounds.top < window.innerHeight && bounds.bottom > geometry.top)
      const useAnchor = anchorBounds && (focusRequested || (anchorBounds.top < window.innerHeight && anchorBounds.bottom > geometry.top))
      const target = useAnchor ? anchor
        : geometry.progress >= 0.5 ? faq.querySelector('h2') : testimony.querySelector('h2')
      const previousTop = target?.getBoundingClientRect().top
      const desiredTop = Math.max(geometry.top + 24, Math.min(window.innerHeight - 120, previousTop ?? geometry.top + 24))
      root.dataset.mode = 'flow'
      geometry.sticky = false
      if (bounds.bottom <= geometry.top && !focusRequested) {
        window.scrollBy({ top: root.getBoundingClientRect().bottom - bounds.bottom, behavior: 'instant' })
      } else if (target && preservePosition) {
        window.scrollBy({ top: target.getBoundingClientRect().top - desiredTop, behavior: 'instant' })
      }
      needsMeasurement = true
      schedule(true)
    }

    function measure() {
      const previous = geometry
      const previousMode = root.dataset.mode
      const before = root.getBoundingClientRect()
      const active = document.activeElement
      const focusInside = active && root.contains(active)
      if (!focusInside) keyboardReading = false
      const activeBounds = active && active !== document.body && active !== document.documentElement
        ? active.getBoundingClientRect() : null
      const activeVisible = activeBounds && activeBounds.top < window.innerHeight && activeBounds.bottom > previous.top
      const externalFocusVisible = !focusInside && activeVisible && active.matches(':focus-visible')
      const faqBounds = faq.getBoundingClientRect()
      const testimonyBounds = testimony.getBoundingClientRect()
      const visibleHeight = bounds => Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, previous.top))
      const footer = document.querySelector('footer')
      const footerBounds = footer?.getBoundingClientRect()
      const viewingFooter = footerBounds && !(focusInside && activeVisible)
        && visibleHeight(footerBounds) > Math.max(visibleHeight(faqBounds), visibleHeight(testimonyBounds))
      const restoreFAQ = focusInside && activeVisible ? faq.contains(active)
        : visibleHeight(faqBounds) > visibleHeight(testimonyBounds)
      const viewportChanged = previous.width !== window.innerWidth || previous.viewportHeight !== window.innerHeight
      const tokens = getComputedStyle(document.documentElement)
      const headerTop = parseFloat(tokens.getPropertyValue('--header-compact-top')) || 16
      const headerHeight = parseFloat(tokens.getPropertyValue('--header-compact-height')) || 106
      const top = headerTop + headerHeight + 12
      const height = Math.max(0, window.innerHeight - top)
      const minimumWaveHeight = 90
      const waveHeight = Math.max(220, Math.min(360, window.innerHeight * 0.34))
      const testimonyHeight = testimony.offsetHeight
      const panels = [...faq.querySelectorAll('[data-faq-answer]')]
      const currentAnswersHeight = panels.reduce((sum, panel) => sum + panel.getBoundingClientRect().height, 0)
      const tallestAnswer = Math.max(0, ...[...faq.querySelectorAll('[data-faq-answer-content]')].map(content => content.getBoundingClientRect().height))
      const faqCurrentHeight = faq.getBoundingClientRect().height
      const faqReadingHeight = faqCurrentHeight - currentAnswersHeight + tallestAnswer
      const faqHeight = Math.max(faqCurrentHeight, faqReadingHeight)
      const availableHeight = height - minimumWaveHeight - 32
      const fits = testimonyHeight <= availableHeight && faqHeight <= availableHeight
      const eligible = desktop.matches && !reduced.matches && !readingRef.current && !keyboardReading && fits

      if (geometry.sticky && !eligible) release(document.activeElement)
      const sticky = eligible
      root.dataset.mode = sticky ? 'sticky' : 'flow'
      root.dataset.motion = reduced.matches ? 'static' : 'animated'
      if (sticky || reduced.matches || root.dataset.flowSettled === 'true') {
        testimony.dataset.revealed = 'true'
        faq.dataset.revealed = 'true'
      }
      // Use each panel's spare space for a taller wave. The wave swells to its
      // full height between panels, then settles below the readable content.
      const testimonyWaveHeight = Math.max(minimumWaveHeight, Math.min(waveHeight, height - testimonyHeight - 32))
      const faqWaveHeight = Math.max(minimumWaveHeight, Math.min(waveHeight, height - faqReadingHeight - 32))
      const testimonyTop = Math.max(16, (height - testimonyWaveHeight - testimonyHeight) / 2)
      const faqTop = Math.max(16, (height - faqWaveHeight - faqReadingHeight) / 2)
      variable('--story-top', top + 'px')
      variable('--story-height', height + 'px')
      variable('--story-distance', window.innerHeight * 2.4 + 'px')
      variable('--story-wave-height', waveHeight + 'px')
      variable('--testimony-top', testimonyTop + 'px')
      variable('--faq-top', faqTop + 'px')
      geometry = {
        sticky, top, height, testimonyTop, faqTop, waveHeight, testimonyWaveHeight, faqWaveHeight,
        span: window.innerHeight * 2.4,
        start: trackRef.current.getBoundingClientRect().top + window.scrollY - top,
        progress: geometry.progress ?? 0,
        width: window.innerWidth,
        viewportHeight: window.innerHeight,
      }

      if (viewportChanged && viewportSnapshot?.viewingFooter && !externalFocusVisible) {
        // Use the last rendered viewport, before responsive content above the
        // footer reflows. Repeated resize events must not accumulate offsets.
        if (viewportSnapshot.atPageEnd) {
          window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight, behavior: 'instant' })
        } else {
          const desiredTop = Math.min(viewportSnapshot.footerTop, window.innerHeight - 180)
          window.scrollBy({ top: footer.getBoundingClientRect().top - desiredTop, behavior: 'instant' })
        }
      } else if (sticky && previousMode) {
        if (previousMode === 'flow' && externalFocusVisible) {
          // Tabbing out must keep the newly focused footer/package link visible.
          window.scrollBy({ top: active.getBoundingClientRect().top - activeBounds.top, behavior: 'instant' })
        } else if (previousMode === 'flow' && viewingFooter) {
          // The wave divider can remain visible above a footer already being
          // read; that is not a reason to seek back into a hidden panel.
          window.scrollBy({ top: footer.getBoundingClientRect().top - footerBounds.top, behavior: 'instant' })
        } else if (before.bottom <= top) {
          // A change in scene height must not pull the footer out of view.
          window.scrollBy({ top: root.getBoundingClientRect().bottom - before.bottom, behavior: 'instant' })
        } else if (previousMode === 'flow' && before.top < window.innerHeight) {
          // Resume at the visible panel's reading interval, never behind waves.
          window.scrollTo({ top: geometry.start + geometry.span * (restoreFAQ ? 0.75 : 0.25), behavior: 'instant' })
        } else if (previousMode === 'sticky' && viewportChanged && previous.progress > 0 && previous.progress < 1) {
          window.scrollTo({ top: geometry.start + geometry.span * previous.progress, behavior: 'instant' })
        }
      }
    }

    function update() {
      frame = 0
      if (disposed) return
      if (needsMeasurement) {
        needsMeasurement = false
        measure()
      }

      let testimonyVisible = true
      if (geometry.sticky) {
        const progress = clamp((window.scrollY - geometry.start) / geometry.span)
        const testimonyReveal = ease(progress / 0.15) * (1 - ease((progress - 0.35) / 0.15))
        const faqReveal = ease((progress - 0.5) / 0.15) * (1 - ease((progress - 0.85) / 0.15))
        geometry.progress = progress
        variable('--story-progress', progress.toFixed(4))
        variable('--wave-scroll', (progress * 2 - 1).toFixed(4))
        const visibleWaveHeight = geometry.waveHeight
          - (geometry.waveHeight - geometry.testimonyWaveHeight) * testimonyReveal
          - (geometry.waveHeight - geometry.faqWaveHeight) * faqReveal
        variable('--story-wave-scale', String(visibleWaveHeight / geometry.waveHeight))
        variable('--testimony-y', (1 - testimonyReveal) * (geometry.height - geometry.testimonyTop + 24) + 'px')
        variable('--testimony-opacity', String(testimonyReveal))
        variable('--faq-y', (1 - faqReveal) * (geometry.height - geometry.faqTop + 24) + 'px')
        variable('--faq-opacity', String(faqReveal))
        testimony.dataset.interactive = String(testimonyReveal > 0.98)
        faq.dataset.interactive = String(faqReveal > 0.98)
        testimonyVisible = testimonyReveal > 0.01
      } else {
        variable('--story-progress', '0')
        variable('--wave-scroll', '0')
        variable('--story-wave-scale', '1')
        testimony.dataset.interactive = 'true'
        faq.dataset.interactive = 'true'
      }

      const sceneBounds = root.getBoundingClientRect()
      const testimonyBounds = testimony.getBoundingClientRect()
      const faqBounds = faq.getBoundingClientRect()
      const footerBounds = document.querySelector('footer')?.getBoundingClientRect()
      const visibleHeight = bounds => Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, geometry.top))
      viewportSnapshot = {
        viewingFooter: footerBounds && visibleHeight(footerBounds) > Math.max(visibleHeight(testimonyBounds), visibleHeight(faqBounds)),
        footerTop: footerBounds?.top,
        atPageEnd: document.documentElement.scrollHeight - window.innerHeight - window.scrollY < 2,
      }
      const sceneVisible = sceneBounds.top < window.innerHeight && sceneBounds.bottom > geometry.top
      testimonyVisible &&= testimonyBounds.top < window.innerHeight && testimonyBounds.bottom > geometry.top
      const running = sceneVisible && !document.hidden && !reduced.matches && !readingRef.current && !keyboardReading
      const nextMotion = { lanes: running && testimonyVisible, waves: running, static: reduced.matches }
      if (!lastMotion || Object.keys(nextMotion).some(key => nextMotion[key] !== lastMotion[key])) {
        lastMotion = nextMotion
        setMotion(nextMotion)
      }
    }

    function schedule(measurement = false) {
      needsMeasurement ||= measurement
      if (!frame && !document.hidden) frame = requestAnimationFrame(update)
    }
    function handleScroll() { if (nearViewport || viewportSnapshot?.viewingFooter) schedule() }
    function handleResize() { schedule(true) }
    function handleVisibility() {
      if (document.hidden) {
        lastMotion = null
        setMotion(previous => ({ ...previous, lanes: false, waves: false }))
      } else schedule(true)
    }

    const visibility = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting
      schedule(true)
    }, { rootMargin: '600px 0px' })
    visibility.observe(root)

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.dataset.revealed = 'true'
      })
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0 })
    for (const panel of [testimony, faq]) {
      panel.dataset.revealed = 'false'
      reveal.observe(panel)
    }

    const resize = new ResizeObserver(handleResize)
    resize.observe(testimony)
    resize.observe(faq)
    faq.querySelectorAll('[data-faq-answer-content]').forEach(content => resize.observe(content))
    if (root.parentElement) resize.observe(root.parentElement)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibility)
    reduced.addEventListener('change', handleResize)
    desktop.addEventListener('change', handleResize)
    document.fonts?.ready.then(() => { if (!disposed) schedule(true) })
    controllerRef.current = { release, schedule }
    schedule(true)

    return () => {
      disposed = true
      controllerRef.current = null
      cancelAnimationFrame(frame)
      visibility.disconnect()
      reveal.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      reduced.removeEventListener('change', handleResize)
      desktop.removeEventListener('change', handleResize)
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.root} data-testimonials-faq onFocusCapture={handleFocus} onKeyDownCapture={handleKeyDown} onBlurCapture={handleBlur}>
      <div ref={trackRef} className={styles.track} data-story-track>
        <div className={styles.stage} data-story-stage>
          <div ref={testimonyRef} className={styles.panel + ' ' + styles.testimony} data-story-testimonies>
            <TestimoniesSection isRunning={motion.lanes} isStatic={motion.static} onReadingModeChange={handleReadingMode} />
          </div>
          <div ref={faqRef} className={styles.panel + ' ' + styles.faq} data-story-faq>
            <FAQsSection />
          </div>
          <div className={styles.waves} aria-hidden="true" data-story-curtain>
            <SectionWaves curtain isRunning={motion.waves} />
          </div>
        </div>
      </div>
    </div>
  )
}
