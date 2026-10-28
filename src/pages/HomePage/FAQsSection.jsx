import { useState } from 'react'
import styles from './FAQsSection.module.css'

const questions = [
  { id: 'services', question: 'What services do you offer?' },
  { id: 'getting-started', question: 'How do we get started?' },
  { id: 'pricing', question: 'How are packages and pricing determined?' },
  { id: 'support', question: 'Do you provide ongoing support?' },
]

const previewAnswer = 'Placeholder answer for layout preview. The approved response will be added before launch.'

export default function FAQsSection() {
  const [openQuestion, setOpenQuestion] = useState(null)

  return (
    <section
      id="home-faqs"
      className={styles.section}
      aria-labelledby="home-faqs-heading"
      data-faq-section
    >
      <div className={styles.inner}>
        <header className={styles.header} data-faq-header>
          <p className={styles.eyebrow}>BEFORE WE SET SAIL</p>
          <h2 id="home-faqs-heading" className={styles.heading}>FREQUENTLY ASKED QUESTIONS</h2>
          <p className={styles.previewLabel}>Preview content — answers pending approval.</p>
        </header>

        <ul className={styles.list} role="list" data-faq-list>
          {questions.map(({ id, question }) => {
            const isOpen = openQuestion === id
            const questionId = `home-faq-question-${id}`
            const answerId = `home-faq-answer-${id}`

            return (
              <li className={styles.item} key={id}>
                <h3 className={styles.questionHeading}>
                  <button
                    id={questionId}
                    type="button"
                    className={styles.questionButton}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenQuestion((current) => current === id ? null : id)}
                  >
                    <span>{question}</span>
                    <svg
                      className={styles.toggleIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M5 12h14" />
                      <path className={styles.verticalStroke} d="M12 5v14" />
                    </svg>
                  </button>
                </h3>

                <div
                  id={answerId}
                  className={styles.answer}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  data-faq-answer
                  data-open={isOpen}
                >
                  <div className={styles.answerClip}>
                    <div className={styles.answerContent} data-faq-answer-content>
                      <p>{previewAnswer}</p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
