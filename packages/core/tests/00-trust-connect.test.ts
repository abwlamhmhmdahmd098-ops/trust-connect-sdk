import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TrustConnect } from '../src/00-trust-connect/engine'
import { NamespaceEngine } from '../src/02-namespace/engine'
import { RegistryBase } from '../src/04-registry/base'
import { CaipController } from '../src/01-caip/controller'
import type {
	CaipWallet,
	NamespaceWallet,
	NamespaceConstructor,
	ServiceConstructor,
	NamespaceId,
	Scope,
	CaipSessionResponse,
} from '../src/types'

// Mock classes
class MockNamespaceConstructor {
	__createNamespace() {
		const namespace = new NamespaceEngine({
			id: 'eip155' as NamespaceId,
			name: 'Ethereum',
			icon: 'data:image/svg+xml;base64,test',
			registries: [],
			rpcUrls: undefined,
		})

		const scope: Scope = {
			ID: 'eip155' as NamespaceId,
			NAME: 'Ethereum',
			CHAINS: ['1'],
			METHODS: { eth_sendTransaction: 'eth_sendTransaction' },
			EVENTS: { accountsChanged: 'accountsChanged' },
		}

		return { namespace, scope }
	}
}

class MockServiceConstructor {
	__createService({ scopes }: { scopes: Map<NamespaceId, Scope> }) {
		const caipWallet: CaipWallet = {
			id: 'walletconnect',
			namespaceIds: ['eip155', 'bip122'] as NamespaceId[],
			type: 'caip',
			name: 'WalletConnect',
			icon: 'data:image/svg+xml;base64,test',
			getProvider: vi.fn().mockResolvedValue({}),
			__internal: {
				connect: vi.fn().mockResolvedValue({
					namespaces: {
						eip155: {
							accounts: ['eip155:1:0x123'],
							chains: ['eip155:1'],
							methods: ['eth_sendTransaction'],
							events: ['accountsChanged'],
						},
					},
				} as CaipSessionResponse),
				reconnect: vi.fn().mockResolvedValue(undefined),
				disconnect: vi.fn(),
				abortConnect: vi.fn(),
				startListeners: vi.fn(),
				stopListeners: vi.fn(),
				handleOnCaipSessionEvent: vi.fn(),
				handleOnCaipSessionDelete: vi.fn(),
				handleOnAddress: vi.fn(),
				handleOnChain: vi.fn(),
				setAddress: vi.fn(),
				setChain: vi.fn(),
				clearAllListeners: vi.fn(),
			},
		} as any

		return {
			caipWallet,
		}
	}
}

class MockNamespaceWallet implements Partial<NamespaceWallet> {
	id = 'metamask'
	namespaceIds = ['eip155'] as [NamespaceId]
	type = 'namespace' as const
	name = 'MetaMask'
	icon = 'data:image/svg+xml;base64,metamask'
	getProvider = vi.fn().mockResolvedValue({})
	__internal = {
		connect: vi.fn().mockResolvedValue({
			address: '0x123',
			chain: { namespace: 'eip155' as NamespaceId, reference: '1' },
		}),
		reconnect: vi.fn().mockResolvedValue({
			address: '0x123',
			chain: { namespace: 'eip155' as NamespaceId, reference: '1' },
		}),
		disconnect: vi.fn(),
		abortConnect: vi.fn(),
		startListeners: vi.fn(),
		stopListeners: vi.fn(),
		handleOnCaipSessionEvent: vi.fn(),
		handleOnCaipSessionDelete: vi.fn(),
		handleOnAddress: vi.fn(),
		handleOnChain: vi.fn(),
		setAddress: vi.fn(),
		setChain: vi.fn(),
		clearAllListeners: vi.fn(),
	}
}

describe('TrustConnect - 00-trust-connect', () => {
	let trustConnect: TrustConnect
	let mockNamespace: MockNamespaceConstructor
	let mockService: MockServiceConstructor

	beforeEach(() => {
		mockNamespace = new MockNamespaceConstructor()
		mockService = new MockServiceConstructor()
	})

	describe('Initialization', () => {
		it('should create the namespaces on init', () => {
			trustConnect = new TrustConnect({
				namespaces: [mockNamespace as any as NamespaceConstructor],
			})

			expect(trustConnect.namespaces).toHaveLength(1)
			expect(trustConnect.namespaces[0]).toBeInstanceOf(NamespaceEngine)
			expect(trustConnect.namespaces[0].id).toBe('eip155')
		})

		it('should create the services on init', () => {
			trustConnect = new TrustConnect({
				namespaces: [mockNamespace as any as NamespaceConstructor],
				services: [mockService as any as ServiceConstructor],
			})

			expect(trustConnect.services).toHaveLength(1)
		})

		it('should init the caip controller and pass down the namespaces and caipWallets', () => {
			trustConnect = new TrustConnect({
				namespaces: [mockNamespace as any as NamespaceConstructor],
				services: [mockService as any as ServiceConstructor],
			})

			expect(trustConnect.caipController).toBeInstanceOf(CaipController)
			expect(trustConnect.caipController.namespaces.size).toBe(1)
			expect(trustConnect.caipController.namespaces.has('eip155')).toBe(true)
			expect(trustConnect.caipController.wallets).toHaveLength(1)
			expect(trustConnect.caipController.wallets[0].id).toBe('walletconnect')
		})
	})

	describe('Listeners and Getters', () => {
		beforeEach(() => {
			trustConnect = new TrustConnect({
				namespaces: [mockNamespace as any as NamespaceConstructor],
				services: [mockService as any as ServiceConstructor],
			})
		})

		it('should listen and set namespace connections and wallets', async () => {
			const connectionCallback = vi.fn()
			trustConnect.onConnections(connectionCallback)

			// Simulate a connection change
			const namespace = trustConnect.namespaces[0]
			namespace.setConnection({
				status: 'connected',
				wallet: new MockNamespaceWallet() as any,
				address: '0x123',
				chain: { namespace: 'eip155' as NamespaceId, reference: '1' },
			})

			expect(connectionCallback).toHaveBeenCalled()
		})

		it('should obtain wallets and connections with getters', () => {
			const wallets = trustConnect.getWallets()
			const connections = trustConnect.getConnections()

			expect(wallets).toBeDefined()
			expect(Array.isArray(wallets)).toBe(true)
			expect(connections).toBeDefined()
			expect(typeof connections).toBe('object')
		})

		it('should merge wallets that share the same name prefix across updates', () => {
			class LocalRegistry extends RegistryBase<NamespaceWallet> {
				protected wallets: NamespaceWallet[] = []
				protected start() {}
				protected stopListeners() {}
			}

			const registry = new LocalRegistry()

			const localNamespace: NamespaceConstructor = {
				__createNamespace: () => {
					const namespace = new NamespaceEngine({
						id: 'eip155' as NamespaceId,
						name: 'Ethereum',
						icon: 'data:image/svg+xml;base64,test',
						registries: [registry],
						rpcUrls: undefined,
					})
					const scope: Scope = {
						ID: 'eip155' as NamespaceId,
						NAME: 'Ethereum',
						CHAINS: ['1'],
						METHODS: { eth_sendTransaction: 'eth_sendTransaction' },
						EVENTS: { accountsChanged: 'accountsChanged' },
					}
					return { namespace, scope }
				},
			}

			trustConnect = new TrustConnect({
				namespaces: [localNamespace],
				services: [mockService as ServiceConstructor],
			})

			const namespaceWallet1 = new MockNamespaceWallet() as unknown as NamespaceWallet
			const namespaceWallet2 = new MockNamespaceWallet() as unknown as NamespaceWallet
			namespaceWallet2.id = 'metamask-2'
			namespaceWallet2.name = 'MetaMask Duplicate'

			registry.setWallets([namespaceWallet1])
			registry.setWallets([namespaceWallet1, namespaceWallet2])

			const wallets = trustConnect.getWallets()
			const walletIds = wallets.map((w) => w.id)
			const uniqueIds = new Set(walletIds)

			expect(walletIds.length).toBe(uniqueIds.size)
			expect(walletIds).toEqual(['metamask'])
		})
	})

	describe('Connect', () => {
		beforeEach(() => {
			trustConnect = new TrustConnect({
				namespaces: [mockNamespace as any as NamespaceConstructor],
				services: [mockService as any as ServiceConstructor],
			})
		})

		it('when hitting connect with a caip type wallet, should be passed down to caipController connect and nothing else', async () => {
			const caipWallet = trustConnect.caipController.wallets[0]
			const caipControllerConnectSpy = vi.spyOn(trustConnect.caipController, 'connect')
			const namespaceConnectSpy = vi.spyOn(trustConnect.namespaces[0], 'connect')

			await trustConnect.connect({ wallet: caipWallet })

			expect(caipControllerConnectSpy).toHaveBeenCalledWith(caipWallet)
			expect(namespaceConnectSpy).not.toHaveBeenCalled()
		})

		it('when hitting connect with a namespace wallet, should be passed to the intended namespace', async () => {
			const namespaceWallet = new MockNamespaceWallet() as any
			const namespaceConnectSpy = vi.spyOn(trustConnect.namespaces[0], 'connect')
			const caipControllerConnectSpy = vi.spyOn(trustConnect.caipController, 'connect')

			await trustConnect.connect({ wallet: namespaceWallet })

			expect(namespaceConnectSpy).toHaveBeenCalledWith(namespaceWallet)
			expect(caipControllerConnectSpy).not.toHaveBeenCalled()
		})

		it('on connect, isLoading should be true, when finished should be false', async () => {
			const caipWallet = trustConnect.caipController.wallets[0]
			let isLoadingDuringConnect: boolean | undefined

			// Mock connect to capture isLoading state
			const originalConnect = caipWallet.__internal.connect
			caipWallet.__internal.connect = vi.fn().mockImplementation(async () => {
				isLoadingDuringConnect = trustConnect.getIsLoading()
				return originalConnect()
			})

			expect(trustConnect.getIsLoading()).toBe(false)

			const connectPromise = trustConnect.connect({ wallet: caipWallet })

			await connectPromise

			expect(isLoadingDuringConnect).toBe(true)
			expect(trustConnect.getIsLoading()).toBe(false)
		})

		it('on connect abort, isLoading should be false', async () => {
			const caipWallet = trustConnect.caipController.wallets[0]

			// Mock connect to delay so we can abort
			caipWallet.__internal.connect = vi.fn().mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(
							() =>
								resolve({
									namespaces: {
										eip155: {
											accounts: ['eip155:1:0x123'],
											chains: ['eip155:1'],
											methods: ['eth_sendTransaction'],
											events: ['accountsChanged'],
										},
									},
								}),
							1000,
						)
					}),
			)

			const connectPromise = trustConnect.connect({ wallet: caipWallet })

			// Wait a bit to ensure connect has started
			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(trustConnect.getIsLoading()).toBe(true)

			trustConnect.abortConnect()

			expect(trustConnect.getIsLoading()).toBe(false)

			// The connect promise might reject or resolve, but isLoading should be false
			try {
				await connectPromise
			} catch (e) {
				// Expected to potentially error
			}

			expect(trustConnect.getIsLoading()).toBe(false)
		})
	})

	describe('Abort', () => {
		beforeEach(() => {
			trustConnect = new TrustConnect({
				namespaces: [mockNamespace as any as NamespaceConstructor],
				services: [mockService as any as ServiceConstructor],
			})
		})

		it('should call abort depending on the namespace id', () => {
			const namespace = trustConnect.namespaces[0]
			const abortConnectSpy = vi.spyOn(namespace, 'abortConnect')

			trustConnect.abortConnect({ namespaceId: 'eip155' as NamespaceId })

			expect(abortConnectSpy).toHaveBeenCalled()
		})

		it('should call abort on all namespaces when no namespace id is provided', () => {
			const namespace = trustConnect.namespaces[0]
			const abortConnectSpy = vi.spyOn(namespace, 'abortConnect')
			const caipAbortSpy = vi.spyOn(trustConnect.caipController, 'abortConnect')

			trustConnect.abortConnect()

			expect(abortConnectSpy).toHaveBeenCalled()
			expect(caipAbortSpy).toHaveBeenCalled()
		})
	})
})
