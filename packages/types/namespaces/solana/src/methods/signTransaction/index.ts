import type { SolanaAddress } from '../../address'
import type { SolanaCommitment } from '../../commitment'

export type SignTransactionMethod = 'signTransaction'

export type SignTransactionOptions = {
	preflightCommitment?: SolanaCommitment
	minContextSlot?: number
}

export type SignTransactionParams = {
	transaction: Uint8Array
	address: SolanaAddress
	options?: SignTransactionOptions
}

export type SignTransactionResponse = {
	signedTransaction: Uint8Array
}
