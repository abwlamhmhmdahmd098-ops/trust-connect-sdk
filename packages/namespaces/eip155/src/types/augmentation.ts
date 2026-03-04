import type { EIP155Provider, EIP155ChainId, EIP155Address } from '@trustwallet/connect-eip155-types'

declare module '@trustwallet/connect-core' {
	interface NamespaceSpecs {
		eip155: {
			provider: EIP155Provider
			address: EIP155Address
			chain: EIP155ChainId
		}
	}
}
