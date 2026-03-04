/**
 * Unisat wallet provider interface
 * Based on: https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet
 */
export interface UnisatWalletAPI {
	requestAccounts(): Promise<string[]>
	connect?(): Promise<{ address: string; publicKey: string }>
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
	sendBitcoin(toAddress: string, satoshis: number): Promise<string>
	on(event: 'accountsChanged', handler: (accounts: string[]) => void): void
	removeListener(event: 'accountsChanged', handler: (accounts: string[]) => void): void
}

declare global {
	interface Window {
		unisat?: UnisatWalletAPI
		unisat_wallet?: UnisatWalletAPI
		bitkeep?: {
			unisat?: UnisatWalletAPI
		}
		binancew3w?: {
			bitcoin: UnisatWalletAPI
		}
	}
}
