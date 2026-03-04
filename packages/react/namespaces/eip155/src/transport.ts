import type { EIP155Provider } from '@trustwallet/connect-eip155-core'
import type { Transport } from 'viem'
import { custom } from 'viem'

/**
 * Creates a Viem custom transport from an EIP155Provider
 * @param provider - The EIP155Provider from the connected wallet
 * @param chain - The chain to use for requests
 */
export function createEIP155Transport(provider: EIP155Provider, chain: { id: number }): Transport {
	return custom({
		async request({ method, params }) {
			// Convert Viem request to EIP155Provider request
			const chainId = `eip155:${chain.id}` as const
			const response = await provider.request({
				request: {
					method: method,
					params: params,
				},
				chainId: chainId,
			})
			return response
		},
	})
}
