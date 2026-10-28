import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import HeroWaves from './HeroWaves.jsx'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const heroRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => document.visibilityState !== 'hidden',
  )

  useEffect(() => {
    const observer = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting)
      })
      : null
    observer?.observe(heroRef.current)

    function handleVisibilityChange() {
      setIsDocumentVisible(document.visibilityState !== 'hidden')
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const waveIsRunning = isVisible && isDocumentVisible

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.content}>
        <p className={`${styles.eyebrow} ${styles.enter}`}>YOUR PARTNER IN DIGITAL GROWTH</p>
        <h1 id="hero-heading" className={`${styles.heading} ${styles.enter}`}>
          <span>NAVIGATE THE NEXT WAVE</span>{' '}
          <span>OF DIGITAL POSSIBILITIES</span>
        </h1>
        <p className={`${styles.description} ${styles.enter}`}>
          A sea of possibilities lies ahead. We understand your business and
          connect the right digital solutions to help you stand strong and grow.
        </p>
        <div className={`${styles.ctaEntrance} ${styles.enter}`}>
          <Link className={styles.callToAction} to="/contact">
            Book a Discovery Call
          </Link>
        </div>
      </div>
      <HeroWaves isRunning={waveIsRunning} />
    </section>
  )
}
