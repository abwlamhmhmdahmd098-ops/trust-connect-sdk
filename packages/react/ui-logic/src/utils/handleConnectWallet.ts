import type { NamespaceId, Wallet, Cast, CaipWallet, NamespaceWallet } from '@trustwallet/connect-headless'

export async function handleConnectWallet({
	wallet,
	namespaceId,
	connect,
}: {
	wallet: Wallet | CaipWallet
	namespaceId?: NamespaceId
	connect: ({ wallet }: { wallet: NamespaceWallet | CaipWallet }) => Promise<void>
}) {
	if (wallet.type === 'caip') {
		await connect({ wallet } as { wallet: CaipWallet })
		return
	}
	if (!namespaceId) {
		console.error('Select a namespace before connecting')
		return
	}
	const namespaceWallet = (wallet.namespaces as Cast['walletNamespaces'])[namespaceId]
	if (!namespaceWallet) {
		console.error(`Wallet ${wallet.id} does not support namespace ${namespaceId}`)
		return
	}
	await connect({ wallet: namespaceWallet })
}
