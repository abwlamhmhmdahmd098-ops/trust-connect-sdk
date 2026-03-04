import type { SolanaChainId } from './chain'
import type { SignMessageMethod, SignMessageParams, SignMessageResponse } from './methods/signMessage'
import type { SignTransactionMethod, SignTransactionParams, SignTransactionResponse } from './methods/signTransaction'
import type {
	SignAndSendTransactionMethod,
	SignAndSendTransactionParams,
	SignAndSendTransactionResponse,
} from './methods/signAndSendTransaction'
import type {
	SignAndSendAllTransactionsMethod,
	SignAndSendAllTransactionsParams,
	SignAndSendAllTransactionsResponse,
} from './methods/signAndSendAllTransactions'
import type { SignInMethod, SignInParams, SignInResponse } from './methods/signIn'

export type SolanaProvider = {
	request<T extends SolanaRequestArguments>(args: SolanaRequestParams<T>): Promise<SolanaResponse<T>>
}

export interface SolanaRequestParams<A> {
	request: A
	chainId: SolanaChainId
}

export type SolanaRequestArguments =
	| {
			method: SignMessageMethod
			params: SignMessageParams
	  }
	| {
			method: SignTransactionMethod
			params: SignTransactionParams
	  }
	| {
			method: SignAndSendTransactionMethod
			params: SignAndSendTransactionParams
	  }
	| {
			method: SignAndSendAllTransactionsMethod
			params: SignAndSendAllTransactionsParams
	  }
	| {
			method: SignInMethod
			params: SignInParams
	  }

export type SolanaResponse<T extends SolanaRequestArguments = SolanaRequestArguments> = T extends {
	method: SignMessageMethod
}
	? SignMessageResponse
	: T extends { method: SignTransactionMethod }
		? SignTransactionResponse
		: T extends { method: SignAndSendTransactionMethod }
			? SignAndSendTransactionResponse
			: T extends { method: SignAndSendAllTransactionsMethod }
				? SignAndSendAllTransactionsResponse
				: T extends { method: SignInMethod }
					? SignInResponse
					: never
