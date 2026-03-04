import styles from './styles.module.css'

type QRButtonProps = {
	onClick: () => void
	disabled?: boolean
	children: string
}

export function QRButton({ onClick, disabled, children }: QRButtonProps) {
	return (
		<button className={styles.button} type="button" onClick={onClick} disabled={disabled}>
			{children}
		</button>
	)
}
