import { NamespaceConstructor, NamespaceEngine, Scope } from '@trustwallet/connect-core'
import { EIP155Registry } from './registry'
import { CreateEIP155Options } from './types/config'
import { EIP155_ICON, EIP155_SCOPE } from './constants'

export function createEIP155(config: CreateEIP155Options): NamespaceConstructor {
	/** Supported chains are added dynamically. */
	const scope: Scope = {
		...EIP155_SCOPE,
		CHAINS: Object.values(config.chains).map((chain) => chain.id.toString()),
	}

	return {
		__createNamespace: () => {
			const registry = new EIP155Registry()

			return {
				namespace: new NamespaceEngine({
					registries: [...(config.registries ?? []), registry],
					id: scope.ID,
					name: scope.NAME,
					icon: EIP155_ICON,
					rpcUrls: config.rpcUrls,
				}),
				scope,
			}
		},
	}
}
