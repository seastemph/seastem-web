import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import PackageWaves from './PackageWaves.jsx'
import styles from './PackageSection.module.css'

const observationUnavailable = () => typeof IntersectionObserver !== 'function'

export default function PackageSection() {
  const panelRef = useRef(null)
  const [hasEntered, setHasEntered] = useState(observationUnavailable)
  const [isVisible, setIsVisible] = useState(observationUnavailable)
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden',
  )

  useEffect(() => {
    const observer = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.intersectionRatio >= 0.15) setHasEntered(true)
      }, { threshold: [0, 0.15] })
      : null
    observer?.observe(panelRef.current)

    function handleVisibilityChange() {
      setIsDocumentVisible(document.visibilityState !== 'hidden')
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <section id="packages" className={styles.section} aria-labelledby="packages-heading">
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.content} data-entered={hasEntered}>
          <p className={styles.eyebrow}>THE RIGHT SUPPORT FOR YOUR NEXT WAVE</p>
          <h2 id="packages-heading" className={styles.heading}>
            <span>CHOOSE YOUR</span>{' '}
            <span>NEXT STEP</span>
          </h2>
          <p className={styles.description}>
            Explore packages built to strengthen your online presence and support growth.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryLink} to="/packages">
              Explore Packages
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className={styles.contactLink} to="/contact">
              Need help choosing? Let’s talk
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <PackageWaves isRunning={isVisible && isDocumentVisible} />
        </div>
      </div>
    </section>
  )
}
