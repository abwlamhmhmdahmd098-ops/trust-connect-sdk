import type { SolanaAddress } from '../../address'
import type { SolanaChainId } from '../../chain'
import type { SolanaCommitment } from '../../commitment'

export type SignAndSendTransactionMethod = 'signAndSendTransaction'

export type SignAndSendTransactionOptions = {
	preflightCommitment?: SolanaCommitment
	minContextSlot?: number
	commitment?: SolanaCommitment
	skipPreflight?: boolean
	maxRetries?: number
}

export type SignAndSendTransactionParams = {
	transaction: Uint8Array
	address: SolanaAddress
	chain: SolanaChainId
	options?: SignAndSendTransactionOptions
}

export type SignAndSendTransactionResponse = {
	signature: Uint8Array
}
