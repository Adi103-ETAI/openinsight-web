'use client'

import { useState } from 'react'
import styles from './Accordion.module.css'

interface AccordionItem {
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          <button
            className={`${styles.header} ${openIndex === index ? styles.active : ''}`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className={styles.title}>{item.title}</span>
            <span className={styles.icon}>▸</span>
          </button>
          <div
            className={`${styles.content} ${openIndex === index ? styles.open : ''}`}
            style={{
              maxHeight: openIndex === index ? '500px' : '0',
            }}
          >
            <div className={styles.inner}>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
