/**
 * BIP122 RPC Types
 */
export type WalletConnectBIP122Request =
	| {
			method: 'getAccounts'
	  }
	| {
			method: 'signMessage'
			params: {
				address: string
				message: string
				protocol?: 'ecdsa' | 'bip322'
			}
	  }
	| {
			method: 'signPsbt'
			params: {
				psbt: string // base64
				signInputs?: Array<{
					index: number
					address?: string
					publicKey?: string
					sighashType?: number
				}>
				broadcast?: boolean
			}
	  }
	| {
			method: 'sendTransfer'
			params: {
				toAddress: string
				satoshis: number
			}
	  }

export type WalletConnectBIP122Response<T extends WalletConnectBIP122Request = WalletConnectBIP122Request> = T extends {
	method: 'getAccounts'
}
	? Array<{
			address: string
			publicKey?: string
			addressType?: string
		}>
	: T extends { method: 'signMessage' }
		? {
				signature: string
				messageHash?: string
				address: string
			}
		: T extends { method: 'signPsbt' }
			? {
					psbt: string // base64
					txid?: string
				}
			: T extends { method: 'sendTransfer' }
				? {
						txid: string
					}
				: never
