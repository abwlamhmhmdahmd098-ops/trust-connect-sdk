import styles from './styles.module.css'

type QRErrorProps = {
	message: string
}

export function QRError({ message }: QRErrorProps) {
	return <div className={styles.error}>{message}</div>
}
