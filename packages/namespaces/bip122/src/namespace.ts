import { formatChainId, NamespaceConstructor, NamespaceEngine, MissingChainError } from '@trustwallet/connect-core'
import { BitcoinWalletStandardRegistry } from './wallets/wallet-standard/registry'
import { BIP122_ICON, BIP122_SCOPE } from './constants'
import { InjectedRegistry } from './wallets/injected/registry'
import { CreateBIP122Options } from './types/config'

export function createBIP122(config: CreateBIP122Options): NamespaceConstructor {
	if (!config.chain) throw new MissingChainError(BIP122_SCOPE.ID)
	const chain = config.chain
	const { reference: chainRef } = formatChainId(chain)

	/** Supported chains are added dynamically. */
	const scope = { ...BIP122_SCOPE, CHAINS: [chainRef] }

	return {
		__createNamespace: () => {
			const standardRegistry = new BitcoinWalletStandardRegistry({ chainRef })
			const injectedRegistry = new InjectedRegistry({ chainRef })

			return {
				namespace: new NamespaceEngine({
					registries: [standardRegistry, injectedRegistry],
					id: scope.ID,
					name: scope.NAME,
					icon: BIP122_ICON,
					rpcUrls: config.rpcUrls,
				}),
				scope,
			}
		},
	}
}
