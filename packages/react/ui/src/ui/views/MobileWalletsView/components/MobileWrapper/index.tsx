import type { ReactNode } from 'react'
import styles from './styles.module.css'

interface MobileWrapperProps {
	children: ReactNode
}

export function MobileWrapper({ children }: MobileWrapperProps) {
	return <div className={styles.container}>{children}</div>
}
