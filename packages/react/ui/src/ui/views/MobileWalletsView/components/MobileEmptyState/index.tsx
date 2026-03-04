import styles from './styles.module.css'

interface MobileEmptyStateProps {
	searchQuery?: string
}

export function MobileEmptyState({ searchQuery }: MobileEmptyStateProps) {
	if (searchQuery) {
		return <div className={styles.empty}>No wallets found for "{searchQuery}"</div>
	}

	return <div className={styles.empty}>No wallets available</div>
}
