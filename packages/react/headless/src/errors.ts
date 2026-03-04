import { BaseError } from '@trustwallet/connect-core'

export class ReactContextError extends BaseError {
	override name = 'ReactContextError'

	constructor(hookName: string, providerName: string) {
		super(`${hookName} must be used within ${providerName}`, 'REACT_CONTEXT_ERROR', {
			hookName,
			providerName,
		})
	}
}

export class MissingRequiredParamError extends BaseError {
	override name = 'MissingRequiredParamError'

	constructor(paramName: string, context?: string) {
		const message = context ? `${paramName} is required. ${context}` : `${paramName} is required`
		super(message, 'MISSING_REQUIRED_PARAM', { paramName, context })
	}
}

export class InvalidResponseError extends BaseError {
	override name = 'InvalidResponseError'

	constructor(source: string) {
		super(`Invalid response from ${source}`, 'INVALID_RESPONSE', { source })
	}
}
