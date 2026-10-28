import { Link } from 'react-router'
import logo from '../assets/brand/logo-footer.png'
import { companyLinks, marketingServices, websiteServices, socialLinks } from '../config/navigation.js'
import styles from './Footer.module.css'

const groups = [
  { title: 'Company', links: companyLinks },
  { title: 'Marketing Services', links: marketingServices },
  { title: 'Website Services', links: websiteServices },
  { title: 'Socials', links: socialLinks },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <nav className={styles.groups} aria-label="Footer navigation">
          {groups.map(({ title, links }) => (
            <div className={styles.group} key={title}>
              <h2>{title}</h2>
              <ul>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    {to ? <Link to={to}>{label}</Link> : <span>{label}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.copyright}>
          <p>© {currentYear} SEASTEM. All rights reserved.</p>
        </div>
      </div>

      <img className={styles.wordmark} src={logo} width="1440" height="193" alt="" loading="lazy" />
    </footer>
  )
}
