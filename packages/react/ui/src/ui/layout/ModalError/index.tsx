import styles from './styles.module.css'

interface ModalErrorProps {
	message: string
}

export function ModalError({ message }: ModalErrorProps) {
	return <div className={styles.error}>Error: {message}</div>
}
