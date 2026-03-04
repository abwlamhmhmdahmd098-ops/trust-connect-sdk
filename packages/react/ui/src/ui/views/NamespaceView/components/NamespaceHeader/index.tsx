import type { Wallet, CaipWallet } from '@trustwallet/connect-headless'
import styles from './styles.module.css'

interface NamespaceHeaderProps {
	targetWallet?: Wallet | CaipWallet | null
}

export function NamespaceHeader({ targetWallet }: NamespaceHeaderProps) {
	return (
		<div className={styles.spacer}>
			<h3 className={styles.sectionTitle}>Namespaces</h3>
			{targetWallet && (
				<span className={styles.badge}>
					<img src={targetWallet.icon} alt={targetWallet.name} className={styles.badgeIcon} />
					{targetWallet.name}
				</span>
			)}
		</div>
	)
}
