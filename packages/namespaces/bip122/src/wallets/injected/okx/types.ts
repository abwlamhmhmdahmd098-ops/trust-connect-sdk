/**
 * OKX wallet API types
 * Based on: https://web3.okx.com/build/dev-docs/sdks/chains/bitcoin/provider
 */
export interface OKXWalletAPI {
	requestAccounts(): Promise<string[]>
	connect(): Promise<{ address: string; publicKey: string }>
	getAccounts(): Promise<string[]>
	getPublicKey(): Promise<string>
	signMessage(message: string, type?: 'ecdsa' | 'bip322-simple'): Promise<string>
	signPsbt(
		psbtHex: string,
		options?: {
			autoFinalized?: boolean
			toSignInputs?: Array<{
				index: number
				address: string
				publicKey: string
				sighashTypes?: number[]
				disableTweakSigner?: boolean
			}>
		},
	): Promise<string>
	pushPsbt(psbtHex: string): Promise<string>
	sendBitcoin(toAddress: string, satoshis: number, options?: { feeRate: number }): Promise<string>
	on(event: 'accountChanged', handler: (addressInfo: { address: string; publicKey: string }) => void): void
	on(event: 'accountsChanged', handler: (accounts: string[]) => void): void
	on(event: string, handler: (...args: unknown[]) => void): void
	removeListener(event: 'accountChanged', handler: (addressInfo: { address: string; publicKey: string }) => void): void
	removeListener(event: 'accountsChanged', handler: (accounts: string[]) => void): void
	removeListener(event: string, handler: (...args: unknown[]) => void): void
}

declare global {
	interface Window {
		okxwallet?: {
			bitcoin?: OKXWalletAPI
		}
	}
}
