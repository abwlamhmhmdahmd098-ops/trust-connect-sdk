import { EIP155_SCOPE } from '@trustwallet/connect-eip155-core'
import { buildChainId } from '@trustwallet/connect-headless'

export { useEIP155Query, useEIP155Mutation, eip155QueryKey } from './hooks/core'
export { useSendTransaction } from './hooks/useSendTransaction'
export { useSignMessage } from './hooks/useSignMessage'
export { useWriteContract } from './hooks/useWriteContract'
export {
	createEIP155,
	type EIP1193Provider,
	type EIP155Address,
	type EIP155ChainId,
	type EIP155Wallet,
	type CreateEIP155Options,
} from '@trustwallet/connect-eip155-core'

export function formatChainId(chainId: number) {
	return buildChainId({ namespace: EIP155_SCOPE.ID, reference: chainId })
}
