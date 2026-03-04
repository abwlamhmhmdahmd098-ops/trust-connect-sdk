/**
 * Xverse address type
 */
export interface XverseAddress {
	address: string
	publicKey: string
	purpose: 'payment' | 'ordinals'
	addressType?: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh'
}

export type XverseErrorResponse = { error: Error }
export type XverseResponse<T> = { result: T }

/**
 * Xverse wallet provider interface
 * Based on: https://docs.xverse.app/sats-connect
 */
export interface XverseWalletAPI {
	request(method: 'wallet_disconnect'): void
	request(method: 'wallet_connect'): Promise<XverseResponse<{ addresses: XverseAddress[] }> | XverseErrorResponse>
	request(
		method: 'getAddresses',
		params: {
			purposes: ('payment' | 'ordinals')[]
		},
	): Promise<XverseResponse<{ addresses: XverseAddress[] }> | XverseErrorResponse>
	request(
		method: 'signMessage',
		params: {
			address: string
			message: string
			protocol?: 'ECDSA' | 'BIP322'
		},
	): Promise<XverseResponse<{ signature: string; messageHash: string; address: string }> | XverseErrorResponse>
	request(
		method: 'signPsbt',
		params: {
			psbt: string // base64
			/**
			 * the keys are the addresses to use for signing
			 * the values are the indexes of the inputs to sign with each address.
			 */
			signInputs: Record<string, number[]>
			broadcast: boolean
		},
	): Promise<XverseResponse<{ psbt: string; txId?: string }> | XverseErrorResponse>
	request(
		method: 'sendTransfer',
		params: { recipients: { address: string; amount: string }[] },
	): Promise<XverseResponse<{ txid: string }> | XverseErrorResponse>
}

declare global {
	interface Window {
		XverseProviders?: {
			BitcoinProvider?: XverseWalletAPI
		}
	}
}
