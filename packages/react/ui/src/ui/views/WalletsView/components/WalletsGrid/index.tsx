import styles from './styles.module.css'
import { ReactNode } from 'react'

interface WalletsGridProps {
	children: ReactNode
}

export function WalletsGrid({ children }: WalletsGridProps) {
	return <div className={styles.grid}>{children}</div>
}
