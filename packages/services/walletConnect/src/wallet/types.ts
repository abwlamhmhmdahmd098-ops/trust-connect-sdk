import type { ChainId } from '@trustwallet/connect-core'

/**
 * Account data structure for each namespace
 */
export type NamespaceAccountData = {
	eip155: {
		address: string
		chainId: ChainId
	}
	solana: {
		pubkey: string
		chainId: ChainId
	}
	bip122: {
		address: string
		publicKey?: Uint8Array
		addressType?: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh'
		chainId: ChainId
	}
}

export type NamespaceId = keyof NamespaceAccountData
