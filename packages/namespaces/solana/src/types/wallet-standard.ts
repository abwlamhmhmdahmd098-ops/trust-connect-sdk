export type IdentifierString = `${string}:${string}`

export interface StandardEventsChangeProperties {
	readonly chains?: WalletStandardWallet['chains']
	readonly features?: WalletStandardWallet['features']
	readonly accounts?: WalletStandardWallet['accounts']
}

export type WalletStandardAccount = {
	address: string
	publicKey: Uint8Array
	label?: string
	icon?: string
}

export type WalletStandardWallet = {
	name: string
	version?: '1.0.0'
	icon: string
	chains: IdentifierString[]
	accounts: WalletStandardAccount[]
	features: Record<IdentifierString, unknown>
}

export type WalletStandardAppReadyApi = {
	register: (wallet: WalletStandardWallet) => void
}

export type WalletStandardRegisterWalletEvent = CustomEvent<(api: WalletStandardAppReadyApi) => void>

export type WalletStandardConnectFeature = {
	connect: () => Promise<{ accounts: WalletStandardAccount[] }>
}

export type WalletStandardDisconnectFeature = {
	disconnect: () => Promise<void>
}

export type WalletStandardEventsFeature = {
	on: (event: 'change', cb: (properties: StandardEventsChangeProperties) => void) => () => void
}
