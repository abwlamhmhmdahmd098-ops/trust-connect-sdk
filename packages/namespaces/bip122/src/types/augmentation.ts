import type { BIP122Provider, BIP122Address, BIP122ChainId } from '@trustwallet/connect-bip122-types'

declare module '@trustwallet/connect-core' {
	interface NamespaceSpecs {
		bip122: {
			provider: BIP122Provider
			address: BIP122Address
			chain: BIP122ChainId
		}
	}
}
