import type { SolanaChainId, SolanaProvider, SolanaAddress } from '@trustwallet/connect-solana-types'

declare module '@trustwallet/connect-core' {
	interface NamespaceSpecs {
		solana: {
			provider: SolanaProvider
			address: SolanaAddress
			chain: SolanaChainId
		}
	}
}
