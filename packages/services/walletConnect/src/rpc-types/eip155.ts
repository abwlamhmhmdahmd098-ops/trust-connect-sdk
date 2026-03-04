/**
 * WalletConnect EIP155 (EVM) RPC Types
 * Based on: https://docs.walletconnect.network/wallet-sdk/chain-support/evm
 */

export type HexString = `0x${string}`

/**
 * WalletConnect EIP155 RPC Request Arguments
 */
export type WalletConnectEIP155Request =
	| {
			method: 'personal_sign'
			params: [message: HexString, account: HexString]
	  }
	| {
			method: 'eth_sign'
			params: [account: HexString, message: HexString]
	  }
	| {
			method: 'eth_signTypedData' | 'eth_signTypedData_v4'
			params: [account: HexString, typedData: string]
	  }
	| {
			method: 'eth_sendTransaction'
			params: [
				{
					from: HexString
					to?: HexString
					data?: HexString
					gas?: HexString
					gasPrice?: HexString
					value?: HexString
					nonce?: HexString
				},
			]
	  }
	| {
			method: 'eth_signTransaction'
			params: [
				{
					from: HexString
					to?: HexString
					data?: HexString
					gas?: HexString
					gasPrice?: HexString
					value?: HexString
					nonce?: HexString
				},
			]
	  }
	| {
			method: 'eth_sendRawTransaction'
			params: [signedTransaction: HexString]
	  }

/**
 * WalletConnect EIP155 RPC Response Types
 */
export type WalletConnectEIP155Response<T extends WalletConnectEIP155Request = WalletConnectEIP155Request> =
	T extends { method: 'personal_sign' }
		? HexString
		: T extends { method: 'eth_sign' }
			? HexString
			: T extends { method: 'eth_signTypedData' | 'eth_signTypedData_v4' }
				? HexString
				: T extends { method: 'eth_sendTransaction' }
					? HexString
					: T extends { method: 'eth_signTransaction' }
						? HexString
						: T extends { method: 'eth_sendRawTransaction' }
							? HexString
							: never
