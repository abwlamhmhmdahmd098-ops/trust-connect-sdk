import type { ReactNode } from 'react'
import styles from './styles.module.css'

interface WCGridProps {
	children: ReactNode
}

export function WCGrid({ children }: WCGridProps) {
	return <div className={styles.grid}>{children}</div>
}
