export type ErrorContext = Record<string, unknown>

export class BaseError extends Error {
	override name = 'TrustConnectError'
	readonly code: string
	readonly context: ErrorContext

	constructor(message: string, code: string, context?: ErrorContext) {
		super(message)
		this.code = code
		this.context = context ?? {}
	}
}
