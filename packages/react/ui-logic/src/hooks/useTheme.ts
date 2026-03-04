import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'auto'
export type ResolvedTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'trust-connect-theme'
const THEME_ATTRIBUTE = 'data-tcui-theme'

function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
	if (typeof window === 'undefined') return 'auto'
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY)
		if (stored === 'light' || stored === 'dark' || stored === 'auto') {
			return stored
		}
	} catch {
		// localStorage might not be available
	}
	return 'auto'
}

// External store for system theme to avoid re-renders
const systemThemeStore = (() => {
	let listeners: (() => void)[] = []
	let mediaQuery: MediaQueryList | null = null

	const subscribe = (callback: () => void) => {
		listeners.push(callback)

		// Initialize media query listener on first subscription
		if (typeof window !== 'undefined' && !mediaQuery) {
			mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
			const handler = () => {
				listeners.forEach((listener) => listener())
			}

			if (mediaQuery.addEventListener) {
				mediaQuery.addEventListener('change', handler)
			} else {
				// Legacy browsers
				mediaQuery.addListener(handler)
			}
		}

		return () => {
			listeners = listeners.filter((l) => l !== callback)
		}
	}

	const getSnapshot = () => getSystemTheme()
	const getServerSnapshot = () => 'light' as ResolvedTheme

	return { subscribe, getSnapshot, getServerSnapshot }
})()

export function useTheme(defaultTheme?: Theme) {
	// Initialize theme only once
	const [theme, setThemeState] = useState<Theme>(() => defaultTheme ?? getStoredTheme())

	// Subscribe to system theme changes
	const systemTheme = useSyncExternalStore(
		systemThemeStore.subscribe,
		systemThemeStore.getSnapshot,
		systemThemeStore.getServerSnapshot
	)

	// Compute resolved theme - only recalculates when theme or systemTheme changes
	const resolvedTheme = useMemo<ResolvedTheme>(() => {
		if (theme === 'auto') {
			return systemTheme
		}
		return theme
	}, [theme, systemTheme])

	// Update DOM when resolved theme changes
	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute(THEME_ATTRIBUTE, resolvedTheme)
		}
	}, [resolvedTheme])

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme)
		try {
			localStorage.setItem(THEME_STORAGE_KEY, newTheme)
		} catch {
			// localStorage might not be available
		}
	}, [])

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}, [resolvedTheme, setTheme])

	return {
		theme,
		resolvedTheme,
		setTheme,
		toggleTheme,
	}
}
