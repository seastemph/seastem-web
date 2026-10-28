import { Link } from 'react-router'
import styles from './PageNotice.module.css'

export default function PageNotice({ title, notFound = false }) {
  return (
    <section className={styles.notice} aria-labelledby="page-title">
      <p className={styles.eyebrow}>{notFound ? '404' : 'Coming soon'}</p>
      <h1 id="page-title">{title}</h1>
      <p className={styles.description}>
        {notFound
          ? 'We couldn’t find that page. Let’s get you back to familiar waters.'
          : 'This page is on its way. In the meantime, take a look at our homepage.'}
      </p>
      <Link className={styles.link} to="/">Back to home <span aria-hidden="true">↗</span></Link>
    </section>
  )
}
