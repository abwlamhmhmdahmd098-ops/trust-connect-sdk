export class Storage {
	private key: string
	private isAvailable(): boolean {
		try {
			return typeof window !== 'undefined' && window.localStorage !== undefined
		} catch {
			return false
		}
	}

	constructor({ key, version }: { key: string; version: string }) {
		this.key = `${key}.${version}`
	}

	set<T>(value: T): void {
		if (!this.isAvailable()) return

		try {
			const serialized = JSON.stringify(value)
			localStorage.setItem(this.key, serialized)
		} catch (error) {
			console.warn(`Failed to save to storage [${this.key}]:`, error)
		}
	}

	get<T>(): T | null {
		if (!this.isAvailable()) return null

		try {
			const item = localStorage.getItem(this.key)
			if (item === null) return null
			return JSON.parse(item) as T
		} catch (error) {
			console.warn(`Failed to load from storage [${this.key}]:`, error)
			return null
		}
	}

	remove(): void {
		if (!this.isAvailable()) return

		try {
			localStorage.removeItem(this.key)
		} catch (error) {
			console.warn(`Failed to remove from storage [${this.key}]:`, error)
		}
	}
}
