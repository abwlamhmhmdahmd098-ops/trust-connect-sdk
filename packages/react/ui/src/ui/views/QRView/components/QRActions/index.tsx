import type { ReactNode } from 'react'
import styles from './styles.module.css'

type QRActionsProps = {
	children: ReactNode
}

/** Wraps the QRButton internally */
export function QRActions({ children }: QRActionsProps) {
	return <div className={styles.actions}>{children}</div>
}
