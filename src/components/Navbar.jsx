import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import logo from '../assets/brand/logo-navbar.png'
import { navLinks, socialLinks } from '../config/navigation.js'
import styles from './Navbar.module.css'

function SocialIcon({ id }) {
  if (id === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M13.7 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.2-1.5 1.6-1.5H17V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.1 1.5-4.1 4.3v2.3H7.7v3.2h2.7V21h3.3Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.9" r=".8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SocialProfiles({ className }) {
  return (
    <ul className={`${styles.socials} ${className}`} aria-label="Social profiles">
      {socialLinks.filter(({ id }) => id !== 'google-business').map(({ id, label }) => (
        <li key={id}>
          <span className={styles.socialIcon} role="img" aria-label={`${label} — profile link coming soon`}>
            <SocialIcon id={id} />
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 40)
  const [openRouteKey, setOpenRouteKey] = useState(null)
  const menuButtonRef = useRef(null)
  const headerRef = useRef(null)
  const location = useLocation()
  const menuOpen = openRouteKey === location.key

  useEffect(() => {
    function handleScroll() {
      const next = window.scrollY > 40
      setIsScrolled((previous) => previous === next ? previous : next)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1200px)')
    function handleViewportChange(event) {
      if (event.matches) setOpenRouteKey(null)
    }

    desktopQuery.addEventListener('change', handleViewportChange)
    return () => desktopQuery.removeEventListener('change', handleViewportChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenRouteKey(null)
        menuButtonRef.current?.focus()
      }
    }

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) setOpenRouteKey(null)
    }

    function handleHistoryNavigation() {
      setOpenRouteKey(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('popstate', handleHistoryNavigation)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('popstate', handleHistoryNavigation)
    }
  }, [menuOpen])

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={`${styles.panel} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} aria-label="Seastem home" onClick={() => setOpenRouteKey(null)}>
            <img src={logo} width="231" height="30" alt="Seastem" />
          </Link>

          <button
            className={styles.menuButton}
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setOpenRouteKey((key) => key === location.key ? null : location.key)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <nav id="primary-navigation" aria-label="Main navigation" className={`${styles.navigation} ${menuOpen ? styles.menuOpen : ''}`}>
            <ul className={styles.navList}>
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'} className={styles.navLink} onClick={() => setOpenRouteKey(null)}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <SocialProfiles className={styles.mobileSocials} />
          </nav>

          <SocialProfiles className={styles.desktopSocials} />
        </div>
      </div>
    </header>
  )
}
