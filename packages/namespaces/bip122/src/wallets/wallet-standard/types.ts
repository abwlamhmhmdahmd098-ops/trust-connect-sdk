/**
 * Bitcoin Wallet Standard types
 * Based on: https://github.com/ExodusMovement/bitcoin-wallet-standard
 */
type BitcoinStandardChain = 'bitcoin:mainnet' | 'bitcoin::testnet' | 'bitcoin:regtest'

export type BitcoinSigHashFlag =
	| 'ALL'
	| 'NONE'
	| 'SINGLE'
	| 'ALL|ANYONECANPAY'
	| 'NONE|ANYONECANPAY'
	| 'SINGLE|ANYONECANPAY'

export type BitcoinWalletStandardAccount = {
	address: string
	publicKey: Uint8Array
	/* Phantom returns it this way */
	purpose?: 'payment' | 'ordinals'
}

export type BitcoinWalletStandardWallet = {
	name: string
	icon?: string
	version?: string
	accounts: BitcoinWalletStandardAccount[]
	features: Record<string, unknown>
	chains: BitcoinStandardChain[]
}

export type SignTransactionInputs = {
	account: BitcoinWalletStandardAccount
	psbt: Uint8Array
	inputsToSign?: Array<{
		account: BitcoinWalletStandardAccount
		signingIndexes: number[]
		sigHash?: BitcoinSigHashFlag
	}>
}

/**
 * Connect feature
 */
export type BitcoinConnectFeature = {
	connect: (input: { purposes: ('ordinals' | 'payment')[] }) => Promise<{ accounts: BitcoinWalletStandardAccount[] }>
}

/**
 * Sign Message feature
 */
export type BitcoinSignMessageFeature = {
	signMessage: (input: {
		account: BitcoinWalletStandardAccount
		message: Uint8Array
		protocol?: 'ecdsa' | 'bip322'
	}) => Promise<
		{
			signature: Uint8Array
			signedMessage: Uint8Array
		}[]
	>
}

/**
 * Sign Transaction feature
 */
export type BitcoinSignTransactionFeature = {
	signTransaction: (input: SignTransactionInputs) => Promise<
		{
			psbt: Uint8Array
		}[]
	>
}

/**
 * Sign and Send Transaction feature
 */
export type BitcoinSignAndSendTransactionFeature = {
	signAndSendTransaction: (input: SignTransactionInputs[]) => Promise<
		{
			txid: string
		}[]
	>
}
