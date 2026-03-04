import { BaseError } from '@trustwallet/connect-core'

export class MissingProjectIdError extends BaseError {
	override name = 'MissingProjectIdError'

	constructor() {
		super('projectId is required', 'MISSING_PROJECT_ID')
	}
}

export class WalletConnectClientNotAvailableError extends BaseError {
	override name = 'WalletConnectClientNotAvailableError'

	constructor() {
		super('WalletConnect client not available', 'WALLETCONNECT_CLIENT_NOT_AVAILABLE')
	}
}

export class WalletConnectServiceNotAvailableError extends BaseError {
	override name = 'WalletConnectServiceNotAvailableError'

	constructor() {
		super('WalletConnect service not available', 'WALLETCONNECT_SERVICE_NOT_AVAILABLE')
	}
}

export class LinkNotReadyError extends BaseError {
	override name = 'LinkNotReadyError'

	constructor() {
		super('Link is not ready. Generate URI first by calling prepareLink().', 'LINK_NOT_READY')
	}
}

export class MissingMobileDeepLinkError extends BaseError {
	override name = 'MissingMobileDeepLinkError'

	constructor(walletName: string) {
		super(`Wallet ${walletName} does not have a mobile deep link.`, 'MISSING_MOBILE_DEEP_LINK', {
			walletName,
		})
	}
}

export class WalletConnectServiceNotInitializedError extends BaseError {
	override name = 'WalletConnectServiceNotInitializedError'

	constructor() {
		super('WalletConnect service has not initialized', 'WALLETCONNECT_SERVICE_NOT_INITIALIZED')
	}
}

export class CaipWalletNotInitializedError extends BaseError {
	override name = 'CaipWalletNotInitializedError'

	constructor() {
		super('CaipWallet not initialized.', 'CAIP_WALLET_NOT_INITIALIZED')
	}
}

export class WalletConnectExplorerApiError extends BaseError {
	override name = 'WalletConnectExplorerApiError'

	constructor(status: number, statusText: string) {
		super(`Failed to fetch wallets: ${status} ${statusText}`, 'WALLETCONNECT_EXPLORER_API_ERROR', {
			status,
			statusText,
		})
	}
}
