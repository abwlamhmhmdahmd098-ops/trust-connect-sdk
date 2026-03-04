/**
 * WalletConnect Solana RPC Types
 * Based on: https://docs.walletconnect.network/wallet-sdk/chain-support/solana
 */

export type Base58String = string
export type Base64String = string

/**
 * Solana commitment levels
 */
export type SolanaCommitment = 'processed' | 'confirmed' | 'finalized'

/**
 * Solana account structure returned by WalletConnect
 */
export type WalletConnectSolanaAccount = {
	pubkey: Base58String
}

/**
 * Send options for Solana transactions
 */
export type SolanaSendOptions = {
	skipPreflight?: boolean
	preflightCommitment?: SolanaCommitment
	maxRetries?: number
}

/**
 * WalletConnect Solana RPC Request Arguments
 */
export type WalletConnectSolanaRequest =
	| {
			method: 'solana_signMessage'
			params: {
				message: Base58String
				pubkey: Base58String
			}
	  }
	| {
			method: 'solana_signTransaction'
			params: {
				transaction: Base64String
			}
	  }
	| {
			method: 'solana_signAllTransactions'
			params: {
				transactions: Base64String[]
			}
	  }
	| {
			method: 'solana_signAndSendTransaction'
			params: {
				transaction: Base64String
				sendOptions?: SolanaSendOptions
			}
	  }

/**
 * WalletConnect Solana RPC Response Types
 */
export type WalletConnectSolanaResponse<T extends WalletConnectSolanaRequest = WalletConnectSolanaRequest> =
	T extends { method: 'solana_signMessage' }
		? { signature: Base58String }
		: T extends { method: 'solana_signTransaction' }
			? { signature: Base58String; transaction?: Base64String }
			: T extends { method: 'solana_signAllTransactions' }
				? { transactions: Base64String[] }
				: T extends { method: 'solana_signAndSendTransaction' }
					? { signature: Base58String }
					: never
