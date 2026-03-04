import type { ReactNode } from 'react'
import styles from './styles.module.css'

type QRWrapperProps = {
	children: ReactNode
}

export function QRWrapper({ children }: QRWrapperProps) {
	return (
		<div className={styles.qr} role="region" aria-label="WalletConnect QR code">
			{children}
		</div>
	)
}
