/**
 * Detects if the user is on a mobile device
 * Checks user agent and touch support
 */
export function isMobile(): boolean {
	if (typeof window === 'undefined') return false

	const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

	// Check for mobile user agents
	const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	const isMobileUA = mobileRegex.test(userAgent)

	// Check for touch support
	const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

	// Check for small screen
	const isSmallScreen = window.innerWidth < 768

	return isMobileUA || (hasTouch && isSmallScreen)
}

/**
 * Gets the current platform (iOS, Android, or desktop)
 */
export function getPlatform(): 'ios' | 'android' | 'desktop' {
	if (typeof window === 'undefined') return 'desktop'

	const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

	if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
		return 'ios'
	}

	if (/android/i.test(userAgent)) {
		return 'android'
	}

	return 'desktop'
}
