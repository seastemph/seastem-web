import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function updateMeta(name, content) {
  let element = document.head.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.append(element)
  }
  element.content = content
}

export default function MainLayout() {
  const matches = useMatches()
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const previousPath = useRef(pathname)
  const metadata = matches.at(-1).handle

  useEffect(() => {
    document.title = metadata.title
    updateMeta('description', metadata.description)
    updateMeta('robots', metadata.noindex ? 'noindex, follow' : 'index, follow')
  }, [metadata])

  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true })
      previousPath.current = pathname
    }
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
