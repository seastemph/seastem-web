export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact Us', to: '/contact' },
]

export const companyLinks = [
  navLinks[0],
  { ...navLinks[1], label: 'About Us' },
  navLinks[4],
  { ...navLinks[5], label: 'Contact' },
]

export const marketingServices = [
  'Digital Marketing',
  'Social Media Management',
  'Search Engine Optimization',
  'Email Marketing',
].map((label) => ({ label, to: '/services' }))

export const websiteServices = [
  'UI/UX Design',
  'Website Development',
  'Custom Applications',
].map((label) => ({ label, to: '/services' }))

// Add official profile destinations here when they are available.
export const socialLinks = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'google-business', label: 'Google Business' },
]
