import { createBrowserRouter } from 'react-router'
import MainLayout from './layouts/MainLayout.jsx'
import HomePage from './pages/HomePage/index.jsx'
import AboutPage from './pages/AboutPage/index.jsx'
import ServicesPage from './pages/ServicesPage/index.jsx'
import PackagesPage from './pages/PackagesPage/index.jsx'
import PortfolioPage from './pages/PortfolioPage/index.jsx'
import FAQsPage from './pages/FAQsPage/index.jsx'
import ContactPage from './pages/ContactPage/index.jsx'
import NotFoundPage from './pages/NotFoundPage/index.jsx'

const placeholderMetadata = (title) => ({
  title: `${title} | Seastem`,
  description: `The Seastem ${title.toLowerCase()} page is coming soon.`,
  noindex: true,
})

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage,
        handle: {
          title: 'Seastem | Your Partner in Digital Growth',
          description: 'A sea of possibilities lies ahead. Discover digital marketing, website design, and development with Seastem, your partner in digital growth.',
          noindex: false,
        },
      },
      { path: 'about', Component: AboutPage, handle: placeholderMetadata('About') },
      { path: 'services', Component: ServicesPage, handle: placeholderMetadata('Services') },
      { path: 'packages', Component: PackagesPage, handle: placeholderMetadata('Packages') },
      { path: 'portfolio', Component: PortfolioPage, handle: placeholderMetadata('Portfolio') },
      { path: 'faqs', Component: FAQsPage, handle: placeholderMetadata('FAQs') },
      { path: 'contact', Component: ContactPage, handle: placeholderMetadata('Contact') },
      {
        path: '*',
        Component: NotFoundPage,
        handle: {
          title: 'Page Not Found | Seastem',
          description: 'This page could not be found. Return to the Seastem homepage.',
          noindex: true,
        },
      },
    ],
  },
])

export default router
