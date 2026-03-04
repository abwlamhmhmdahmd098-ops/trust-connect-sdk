import styles from './styles.module.css'

interface WalletsHeaderProps {
	namespaceName: string
}

export function WalletsHeader({ namespaceName }: WalletsHeaderProps) {
	return <p className={styles.sectionSub}>Connect to {namespaceName}</p>
}
