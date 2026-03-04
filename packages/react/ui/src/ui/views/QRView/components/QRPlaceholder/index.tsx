import type { ReactNode } from 'react'
import styles from './styles.module.css'

type QRPlaceholderProps = {
	children: ReactNode
}

export function QRPlaceholder({ children }: QRPlaceholderProps) {
	return <div className={styles.placeholder}>{children}</div>
}
