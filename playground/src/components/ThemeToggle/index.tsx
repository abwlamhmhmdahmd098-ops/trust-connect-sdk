import { useTheme } from '@trustwallet/connect-react'
import styles from './styles.module.css'

type ThemeToggleProps = {
	className?: string
	variant?: 'icon' | 'button'
	showLabel?: boolean
}

export function ThemeToggle({ className, variant = 'icon', showLabel = false }: ThemeToggleProps) {
	const { resolvedTheme, toggleTheme } = useTheme()

	const isDark = resolvedTheme === 'dark'

	if (variant === 'button') {
		return (
			<button
				type="button"
				className={`${styles.themeToggle} ${styles.button} ${className || ''}`}
				onClick={toggleTheme}
				aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
			>
				{isDark ? <SunIcon /> : <MoonIcon />}
				{showLabel && <span>{isDark ? 'Light' : 'Dark'}</span>}
			</button>
		)
	}

	return (
		<button
			type="button"
			className={`${styles.themeToggle} ${styles.icon} ${className || ''}`}
			onClick={toggleTheme}
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
		>
			{isDark ? <SunIcon /> : <MoonIcon />}
		</button>
	)
}

function SunIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			width="20"
			height="20"
			stroke="currentColor"
		>
			<circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function MoonIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			width="20"
			height="20"
			stroke="currentColor"
		>
			<path
				d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
