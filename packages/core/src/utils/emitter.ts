export type EventMap = Record<string, unknown>

export class Emitter<E extends EventMap> {
	private listeners = new Map<keyof E, Set<(payload: E[keyof E]) => void>>()

	on<K extends keyof E>(event: K, handler: (payload: E[K]) => void): () => void {
		let set = this.listeners.get(event)
		if (!set) {
			set = new Set()
			this.listeners.set(event, set)
		}

		set.add(handler as (payload: E[keyof E]) => void)

		return () => this.off(event, handler)
	}

	off<K extends keyof E>(event: K, handler: (payload: E[K]) => void): void {
		const set = this.listeners.get(event)
		if (!set) return

		set.delete(handler as (payload: E[keyof E]) => void)
		if (set.size === 0) this.listeners.delete(event)
	}

	emit<K extends keyof E>(event: K, payload: E[K]): void {
		const set = this.listeners.get(event)
		if (!set) return

		for (const handler of [...set]) {
			try {
				handler(payload)
			} catch (error) {
				console.error(error)
			}
		}
	}

	clear(event?: keyof E): void {
		if (event) this.listeners.delete(event)
		else this.listeners.clear()
	}
}
