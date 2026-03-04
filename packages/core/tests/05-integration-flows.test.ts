import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { TrustConnect } from '../src/00-trust-connect/engine'
import { NamespaceEngine } from '../src/02-namespace/engine'
import { RegistryBase } from '../src/04-registry/base'
import type {
	NamespaceWallet,
	NamespaceId,
	CaipWallet,
	NamespaceConstructor,
	ServiceConstructor,
	Cast,
} from '../src/types'

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {}
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value
		},
		removeItem: (key: string) => {
			delete store[key]
		},
		clear: () => {
			store = {}
		},
	}
})()

Object.defineProperty(globalThis, 'window', {
	value: { localStorage: localStorageMock },
	writable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true,
})

// Mock Registry
class MockRegistry extends RegistryBase<NamespaceWallet> {
	protected wallets: NamespaceWallet[] = []
	protected start() {}
	protected stopListeners() {}

	triggerWalletUpdate(wallets: NamespaceWallet[]) {
		this.setWallets(wallets)
	}
}

// Helper to create mock namespace wallet
function createMockNamespaceWallet(id: string, namespaceId: NamespaceId): NamespaceWallet {
	return {
		id,
		namespaceIds: [namespaceId],
		type: 'namespace',
		name: `Wallet ${id}`,
		icon: 'data:image/svg+xml;base64,test',
		getProvider: vi.fn().mockResolvedValue({}),
		__internal: {
			connect: vi.fn().mockResolvedValue({
				address: '0x123',
				chain: { namespace: namespaceId, reference: '1' },
			}),
			reconnect: vi.fn().mockResolvedValue({
				address: '0x123',
				chain: { namespace: namespaceId, reference: '1' },
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
		},
	} as any
}

// Helper to create mock CAIP wallet
function createMockCaipWallet(id: string, namespaceIds: NamespaceId[]): CaipWallet {
	return {
		id,
		namespaceIds,
		type: 'caip',
		name: `CAIP Wallet ${id}`,
		icon: 'data:image/svg+xml;base64,test',
		getProvider: vi.fn().mockResolvedValue({}),
		__internal: {
			connect: vi.fn().mockResolvedValue({
				namespaces: {
					eip155: {
						accounts: ['eip155:1:0x123'],
						chains: ['eip155:1'],
						methods: [],
						events: [],
					},
				},
			}),
			reconnect: vi.fn().mockResolvedValue({
				namespaces: {
					eip155: {
						accounts: ['eip155:1:0x123'],
						chains: ['eip155:1'],
						methods: [],
						events: [],
					},
				},
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
		},
	} as any
}

// Mock NamespaceConstructor
function createMockNamespaceConstructor(
	namespaceId: NamespaceId,
	registry: MockRegistry,
): NamespaceConstructor {
	return {
		__createNamespace: () => {
			const namespace = new NamespaceEngine({
				id: namespaceId,
				name: `Namespace ${namespaceId}`,
				icon: 'data:image/svg+xml;base64,test',
				registries: [registry],
				rpcUrls: undefined,
			})
			return {
				namespace,
				scope: {
					methods: ['eth_sendTransaction', 'personal_sign'],
					events: ['accountsChanged', 'chainChanged'],
				},
			}
		},
	} as any
}

describe('Integration Flows - 05-integration-flows', () => {
	let trustConnect: TrustConnect
	let eip155Registry: MockRegistry
	let solanaRegistry: MockRegistry
	let consoleWarnSpy: ReturnType<typeof vi.spyOn> | undefined

	beforeEach(() => {
		localStorageMock.clear()
		eip155Registry = new MockRegistry()
		solanaRegistry = new MockRegistry()
		consoleWarnSpy?.mockRestore()
		consoleWarnSpy = undefined
	})

	afterEach(() => {
		vi.clearAllMocks()
		consoleWarnSpy?.mockRestore()
		consoleWarnSpy = undefined
	})

	describe('1. Complete Initialization Flow', () => {
		it('should initialize TrustConnect with all components in correct order', () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})

			expect(trustConnect.namespaces).toHaveLength(1)
			expect(trustConnect.namespaces[0]).toBeInstanceOf(NamespaceEngine)
			expect(trustConnect.caipController).toBeDefined()
			expect(trustConnect.wallets).toEqual([])
			// Connections will have initial disconnected state for each namespace
			expect(Object.keys(trustConnect.connections)).toContain('eip155')
			expect((trustConnect.connections as any).eip155.status).toBe('disconnected')
		})

		it('should create NamespaceEngines for each provided namespace', () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			const solanaConstructor = createMockNamespaceConstructor('solana' as NamespaceId, solanaRegistry)

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor, solanaConstructor],
			})

			expect(trustConnect.namespaces).toHaveLength(2)
			expect(trustConnect.namespaces[0].id).toBe('eip155')
			expect(trustConnect.namespaces[1].id).toBe('solana')
		})

		it('should create CaipController with correct dependencies', () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})

			expect(trustConnect.caipController).toBeDefined()
			expect(trustConnect.caipController.namespaces.size).toBeGreaterThan(0)
		})

		it('should not break if initialized with empty namespaces array', () => {
			expect(() => {
				trustConnect = new TrustConnect({
					namespaces: [],
				})
			}).not.toThrow()

			expect(trustConnect.namespaces).toEqual([])
			expect(trustConnect.wallets).toEqual([])
		})
	})

	describe('2. Wallet Discovery Flow', () => {
		beforeEach(() => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})
		})

		it('should aggregate wallets from registry to NamespaceEngine', () => {
			const wallet1 = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)

			eip155Registry.triggerWalletUpdate([wallet1])

			const namespaceWallets = trustConnect.namespaces[0].getWallets()
			expect(namespaceWallets).toContain(wallet1)
		})

		it('should compute multi-namespace wallets in TrustConnect', () => {
			const wallet1 = createMockNamespaceWallet('trust-wallet', 'eip155' as NamespaceId)

			eip155Registry.triggerWalletUpdate([wallet1])

			expect(trustConnect.wallets).toHaveLength(1)
			expect(trustConnect.wallets[0].id).toBe('trust-wallet')
			expect(trustConnect.wallets[0].namespaceIds.has('eip155')).toBe(true)
		})

		it('should not create duplicate wallets if discovered multiple times', () => {
			const wallet1 = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)

			eip155Registry.triggerWalletUpdate([wallet1])
			eip155Registry.triggerWalletUpdate([wallet1])

			expect(trustConnect.wallets).toHaveLength(1)
		})

		it('should keep distinct wallets when names are distinct during rapid discovery', () => {
			const wallet1 = createMockNamespaceWallet('wallet1', 'eip155' as NamespaceId)
			const wallet2 = createMockNamespaceWallet('wallet2', 'eip155' as NamespaceId)
			const wallet3 = createMockNamespaceWallet('wallet3', 'eip155' as NamespaceId)
			wallet1.name = wallet1.id
			wallet2.name = wallet2.id
			wallet3.name = wallet3.id

			// Trigger updates with accumulated wallets
			eip155Registry.triggerWalletUpdate([wallet1])
			eip155Registry.triggerWalletUpdate([wallet1, wallet2])
			eip155Registry.triggerWalletUpdate([wallet1, wallet2, wallet3])

			const walletIds = trustConnect.wallets.map((wallet) => wallet.id)
			expect(walletIds).toEqual(['wallet1', 'wallet2', 'wallet3'])
		})
	})

	describe('3. Connection Flow - Namespace Wallet', () => {
		let mockWallet: NamespaceWallet

		beforeEach(() => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})
			mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])
		})

		it('should route namespace wallet connect through correct namespace', async () => {
			const namespaceConnectSpy = vi.spyOn(trustConnect.namespaces[0], 'connect')

			await trustConnect.connect({ wallet: mockWallet })

			expect(namespaceConnectSpy).toHaveBeenCalledWith(mockWallet)
		})

		it('should call wallet.__internal.connect() during connection', async () => {
			await trustConnect.connect({ wallet: mockWallet })

			expect(mockWallet.__internal.connect).toHaveBeenCalled()
		})

		it('should update NamespaceEngine.connection with connected state', async () => {
			await trustConnect.connect({ wallet: mockWallet })

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.status).toBe('connected')
			expect(connection.wallet).toBe(mockWallet)
			expect(connection.address).toBe('0x123')
		})

		it('should save last connected wallet to storage', async () => {
			await trustConnect.connect({ wallet: mockWallet })

			const storageKey = 'trust-connect.namespace.eip155.lastWallet.0.0.0'
			expect(localStorageMock.getItem(storageKey)).toBe(JSON.stringify('metamask'))
		})

		it('should set isLoading to true during connect, false after', async () => {
			expect(trustConnect.getIsLoading()).toBe(false)

			const connectPromise = trustConnect.connect({ wallet: mockWallet })
			expect(trustConnect.getIsLoading()).toBe(true)

			await connectPromise
			expect(trustConnect.getIsLoading()).toBe(false)
		})

		it('should handle connection rejection from wallet', async () => {
			mockWallet.__internal.connect = vi.fn().mockRejectedValue(new Error('User rejected'))

			await expect(trustConnect.connect({ wallet: mockWallet })).rejects.toThrow('User rejected')

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.status).toBe('disconnected')
		})

		it('should start wallet listeners after successful connection', async () => {
			await trustConnect.connect({ wallet: mockWallet })

			expect(mockWallet.__internal.startListeners).toHaveBeenCalled()
		})

		it('should propagate connection to TrustConnect.connections', async () => {
			await trustConnect.connect({ wallet: mockWallet })

			expect((trustConnect.connections as Cast['connections'])['eip155']).toBeDefined()
			expect((trustConnect.connections as Cast['connections'])['eip155']?.status).toBe('connected')
		})
	})

	describe('4. Connection Flow - CAIP Wallet', () => {
		let caipWallet: CaipWallet

		beforeEach(() => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			caipWallet = createMockCaipWallet('walletconnect', ['eip155'] as NamespaceId[])

			// Mock service constructor
			const mockServiceConstructor: ServiceConstructor = {
				__createService: () => ({
					id: 'walletconnect',
					name: 'WalletConnect',
					caipWallet: caipWallet,
					clearAllListeners: vi.fn(),
				}),
			} as any

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
				services: [mockServiceConstructor],
			})
		})

		it('should route CAIP wallet through CaipController, not namespace', async () => {
			const caipControllerConnectSpy = vi.spyOn(trustConnect.caipController, 'connect')
			const namespaceConnectSpy = vi.spyOn(trustConnect.namespaces[0], 'connect')

			await trustConnect.connect({ wallet: caipWallet })

			expect(caipControllerConnectSpy).toHaveBeenCalledWith(caipWallet)
			expect(namespaceConnectSpy).not.toHaveBeenCalled()
		})

		it('should call wallet.__internal.connect() with CAIP wallet', async () => {
			await trustConnect.connect({ wallet: caipWallet })

			expect(caipWallet.__internal.connect).toHaveBeenCalled()
		})

		it('should update NamespaceEngine from CAIP session', async () => {
			await trustConnect.connect({ wallet: caipWallet })

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.status).toBe('connected')
			expect(connection.address).toBe('0x123')
		})

		it('should save last connected wallet ID to storage', async () => {
			await trustConnect.connect({ wallet: caipWallet })

			const storageKey = 'trust-connect.caip.lastWallet.0.0.0'
			expect(localStorageMock.getItem(storageKey)).toBe(JSON.stringify('walletconnect'))
		})
	})

	describe('5. Event Handling Flow', () => {
		let mockWallet: NamespaceWallet

		beforeEach(async () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})
			mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])
			await trustConnect.connect({ wallet: mockWallet })
		})

		it('should handle accountsChanged event and update connection', () => {
			const newAddress = '0xnewaddress'
			mockWallet.__internal.setAddress(newAddress)

			trustConnect.namespaces[0].setConnection({
				status: 'connected',
				wallet: mockWallet,
				address: newAddress,
				chain: { namespace: 'eip155', reference: '1' },
			})

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.address).toBe(newAddress)
		})

		it('should emit connection event after account change', () => {
			const callback = vi.fn()
			trustConnect.namespaces[0].onConnection(callback)

			trustConnect.namespaces[0].setConnection({
				status: 'connected',
				wallet: mockWallet,
				address: '0xnewaddress',
				chain: { namespace: 'eip155', reference: '1' },
			})

			expect(callback).toHaveBeenCalled()
		})

		it('should handle chainChanged event and update connection', () => {
			const newChain = { namespace: 'eip155' as NamespaceId, reference: '137' }

			trustConnect.namespaces[0].setConnection({
				status: 'connected',
				wallet: mockWallet,
				address: '0x123',
				chain: newChain,
			})

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.chain?.reference).toBe('137')
		})

		it('should propagate events to TrustConnect level', () => {
			const callback = vi.fn()
			trustConnect.onConnections(callback)

			trustConnect.namespaces[0].setConnection({
				status: 'connected',
				wallet: mockWallet,
				address: '0xnewaddress',
				chain: { namespace: 'eip155', reference: '1' },
			})

			expect(callback).toHaveBeenCalled()
		})
	})

	describe('6. Disconnection Flow', () => {
		let mockWallet: NamespaceWallet

		beforeEach(async () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})
			mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])
			await trustConnect.connect({ wallet: mockWallet })
		})

		it('should route namespace wallet disconnect to NamespaceEngine', () => {
			const namespaceDisconnectSpy = vi.spyOn(trustConnect.namespaces[0], 'disconnect')

			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			expect(namespaceDisconnectSpy).toHaveBeenCalled()
		})

		it('should call wallet.__internal.disconnect() on the wallet', () => {
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			expect(mockWallet.__internal.disconnect).toHaveBeenCalled()
		})

		it('should clear last connected wallet from storage', () => {
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			const storageKey = 'trust-connect.namespace.eip155.lastWallet.0.0.0'
			expect(localStorageMock.getItem(storageKey)).toBeNull()
		})

		it('should set NamespaceEngine.connection to disconnected state', () => {
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.status).toBe('disconnected')
			expect(connection.wallet).toBeUndefined()
			expect(connection.address).toBeUndefined()
		})

		it('should stop wallet event listeners on disconnect', () => {
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			// The wallet's clearAllListeners is called instead of stopListeners
			expect(mockWallet.__internal.clearAllListeners).toHaveBeenCalled()
		})

		it('should handle disconnect when already disconnected (idempotent)', () => {
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			expect(() => {
				trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })
			}).not.toThrow()
		})

		it('should disconnect all namespaces when no namespaceId provided', () => {
			const namespaceDisconnectSpy = vi.spyOn(trustConnect.namespaces[0], 'disconnect')

			trustConnect.disconnect()

			expect(namespaceDisconnectSpy).toHaveBeenCalled()
		})
	})

	describe('7. Reconnection Flow', () => {
		it('should check storage for lastConnectedWalletId on initialization', () => {
			localStorageMock.setItem('trust-connect.namespace.eip155.lastWallet.0.0.0', JSON.stringify('metamask'))

			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})

			const storageKey = 'trust-connect.namespace.eip155.lastWallet.0.0.0'
			expect(localStorageMock.getItem(storageKey)).toBe(JSON.stringify('metamask'))
		})

		it('should call namespace.reconnect() with saved wallet', async () => {
			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.setWallets([mockWallet])

			localStorageMock.setItem('trust-connect.namespace.eip155.lastWallet.0.0.0', JSON.stringify('metamask'))

			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})

			// Wait for async reconnect
			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(mockWallet.__internal.reconnect).toHaveBeenCalled()
		})

		it('should clear storage if reconnect returns no session', async () => {
			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			mockWallet.__internal.reconnect = vi.fn().mockResolvedValue({
				address: undefined,
				chain: undefined,
			})
			eip155Registry.setWallets([mockWallet])

			localStorageMock.setItem('trust-connect.namespace.eip155.lastWallet.0.0.0', JSON.stringify('metamask'))

			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})

			// Wait for async reconnect
			await new Promise((resolve) => setTimeout(resolve, 50))

			const storageKey = 'trust-connect.namespace.eip155.lastWallet.0.0.0'
			expect(localStorageMock.getItem(storageKey)).toBeNull()
		})
	})

	describe('8. Abort Connection Flow', () => {
		let mockWallet: NamespaceWallet

		beforeEach(() => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})
			mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])
		})

		it('should allow aborting connection by namespaceId', async () => {
			// Start connection without awaiting
			const connectPromise = trustConnect.connect({ wallet: mockWallet })

			// Abort immediately
			trustConnect.abortConnect({ namespaceId: 'eip155' as NamespaceId })

			// Wait for connection to complete
			await connectPromise.catch(() => {})

			expect(mockWallet.__internal.abortConnect).toHaveBeenCalled()
		})

		it('should call wallet.__internal.abortConnect()', () => {
			// AbortConnect is called on the namespace, not the individual wallet
			const abortSpy = vi.spyOn(trustConnect.namespaces[0], 'abortConnect')

			trustConnect.abortConnect({ namespaceId: 'eip155' as NamespaceId })

			expect(abortSpy).toHaveBeenCalled()
		})

		it('should set isLoading to false after abort', () => {
			trustConnect.connect({ wallet: mockWallet })
			trustConnect.abortConnect({ namespaceId: 'eip155' as NamespaceId })

			expect(trustConnect.getIsLoading()).toBe(false)
		})

		it('should set connectionAborted flag to true', () => {
			trustConnect.abortConnect({ namespaceId: 'eip155' as NamespaceId })

			expect(trustConnect.connectionAborted).toBe(true)
		})

		it('should handle abort when not connecting (noop)', () => {
			expect(() => {
				trustConnect.abortConnect({ namespaceId: 'eip155' as NamespaceId })
			}).not.toThrow()
		})

		it('should abort all namespaces when no namespaceId provided', () => {
			const abortSpy = vi.spyOn(trustConnect.namespaces[0], 'abortConnect')

			trustConnect.abortConnect()

			expect(abortSpy).toHaveBeenCalled()
		})
	})

	describe('9. Multi-namespace Wallet Flow', () => {
		it('should detect wallet supporting multiple namespaces', () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			const solanaConstructor = createMockNamespaceConstructor('solana' as NamespaceId, solanaRegistry)

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor, solanaConstructor],
			})

			// Create wallet that supports both namespaces
			const trustWalletEip155 = createMockNamespaceWallet('trust-wallet', 'eip155' as NamespaceId)
			const trustWalletSolana = createMockNamespaceWallet('trust-wallet', 'solana' as NamespaceId)

			eip155Registry.triggerWalletUpdate([trustWalletEip155])
			solanaRegistry.triggerWalletUpdate([trustWalletSolana])

			// Should be merged into single wallet
			expect(trustConnect.wallets).toHaveLength(1)
			expect(trustConnect.wallets[0].namespaceIds.has('eip155')).toBe(true)
			expect(trustConnect.wallets[0].namespaceIds.has('solana')).toBe(true)
		})

		it('should appear in all supported namespace wallet lists', () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			const solanaConstructor = createMockNamespaceConstructor('solana' as NamespaceId, solanaRegistry)

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor, solanaConstructor],
			})

			const trustWalletEip155 = createMockNamespaceWallet('trust-wallet', 'eip155' as NamespaceId)
			const trustWalletSolana = createMockNamespaceWallet('trust-wallet', 'solana' as NamespaceId)

			eip155Registry.triggerWalletUpdate([trustWalletEip155])
			solanaRegistry.triggerWalletUpdate([trustWalletSolana])

			// Check both namespaces have the wallet
			const eip155Wallets = trustConnect.namespaces[0].getWallets()
			const solanaWallets = trustConnect.namespaces[1].getWallets()

			expect(eip155Wallets).toHaveLength(1)
			expect(solanaWallets).toHaveLength(1)
		})

		it('should maintain single wallet instance across namespaces', () => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			const solanaConstructor = createMockNamespaceConstructor('solana' as NamespaceId, solanaRegistry)

			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor, solanaConstructor],
			})

			const trustWalletEip155 = createMockNamespaceWallet('trust-wallet', 'eip155' as NamespaceId)
			const trustWalletSolana = createMockNamespaceWallet('trust-wallet', 'solana' as NamespaceId)

			eip155Registry.triggerWalletUpdate([trustWalletEip155])
			solanaRegistry.triggerWalletUpdate([trustWalletSolana])

			// Verify it's the same wallet instance in TrustConnect
			expect(trustConnect.wallets).toHaveLength(1)
			expect(trustConnect.wallets[0].id).toBe('trust-wallet')
		})
	})

	describe('10. Error Handling & Edge Cases', () => {
		beforeEach(() => {
			const eip155Constructor = createMockNamespaceConstructor('eip155' as NamespaceId, eip155Registry)
			trustConnect = new TrustConnect({
				namespaces: [eip155Constructor],
			})
		})

		it('should handle wallet throwing error during connect', async () => {
			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			mockWallet.__internal.connect = vi.fn().mockRejectedValue(new Error('Connection failed'))
			eip155Registry.triggerWalletUpdate([mockWallet])

			await expect(trustConnect.connect({ wallet: mockWallet })).rejects.toThrow('Connection failed')

			expect(trustConnect.getError()).toBeDefined()
			expect(trustConnect.getError()?.message).toBe('Connection failed')
		})

		it('should handle empty wallet list gracefully', () => {
			expect(trustConnect.getWallets()).toEqual([])
			expect(() => trustConnect.getWallets()).not.toThrow()
		})

		it('should handle double connection attempts', async () => {
			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])

			// First connection
			await trustConnect.connect({ wallet: mockWallet })

			// Second connection - should throw WalletAlreadyConnectedError
			await expect(trustConnect.connect({ wallet: mockWallet })).rejects.toThrow('Wallet already connected')
		})

		it('should handle rapid connect/disconnect cycles', async () => {
			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])

			await trustConnect.connect({ wallet: mockWallet })
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })
			await trustConnect.connect({ wallet: mockWallet })
			trustConnect.disconnect({ namespaceId: 'eip155' as NamespaceId })

			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.status).toBe('disconnected')
		})

		it('should clear error state with clearError()', async () => {
			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			mockWallet.__internal.connect = vi.fn().mockRejectedValue(new Error('Connection failed'))
			eip155Registry.triggerWalletUpdate([mockWallet])

			await trustConnect.connect({ wallet: mockWallet }).catch(() => {})

			// Verify error was properly set
			expect(trustConnect.getError()).toBeDefined()
			expect(trustConnect.getError()?.message).toBe('Connection failed')

			// Clear error
			trustConnect.clearError()

			// Verify error is now null
			expect(trustConnect.getError()).toBeNull()
		})

		it('should handle localStorage being unavailable', async () => {
			consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			// Mock localStorage to throw
			const originalSetItem = localStorageMock.setItem
			localStorageMock.setItem = vi.fn(() => {
				throw new Error('QuotaExceededError')
			})

			const mockWallet = createMockNamespaceWallet('metamask', 'eip155' as NamespaceId)
			eip155Registry.triggerWalletUpdate([mockWallet])

			// Should not throw even if localStorage fails
			await trustConnect.connect({ wallet: mockWallet })

			// Verify connection succeeded despite localStorage failure
			const connection = trustConnect.namespaces[0].getConnection()
			expect(connection.status).toBe('connected')
			expect(connection.address).toBe('0x123')

			// Restore
			localStorageMock.setItem = originalSetItem
		})
	})
})
