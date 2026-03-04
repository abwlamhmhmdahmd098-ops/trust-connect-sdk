import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { RegistryBase } from '../src/04-registry/base'
import type { NamespaceWallet, NamespaceId } from '../src/types'

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

// Concrete implementation of RegistryBase for testing
class TestRegistry extends RegistryBase<NamespaceWallet> {
	protected wallets: NamespaceWallet[] = []
	private startCalled = false
	private stopListenersCalled = false

	protected start() {
		this.startCalled = true
	}

	protected stopListeners() {
		this.stopListenersCalled = true
	}

	// Helper methods for testing
	public getStartCalled() {
		return this.startCalled
	}

	public getStopListenersCalled() {
		return this.stopListenersCalled
	}
}

describe('RegistryBase - 04-registry', () => {
	let registry: TestRegistry
	let mockWallet1: NamespaceWallet
	let mockWallet2: NamespaceWallet

	beforeEach(() => {
		registry = new TestRegistry()
		mockWallet1 = createMockNamespaceWallet('wallet1', 'eip155' as NamespaceId)
		mockWallet2 = createMockNamespaceWallet('wallet2', 'eip155' as NamespaceId)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('Getters', () => {
		it('getWallets() should return the current wallets array', () => {
			registry.setWallets([mockWallet1, mockWallet2])

			const wallets = registry.getWallets()

			expect(wallets).toEqual([mockWallet1, mockWallet2])
		})

		it('getWallets() should return empty array if no wallets exist', () => {
			const wallets = registry.getWallets()

			expect(wallets).toEqual([])
			expect(Array.isArray(wallets)).toBe(true)
		})
	})

	describe('Event Listeners', () => {
		it('onWallets() should register a callback for wallet changes', () => {
			const callback = vi.fn()

			registry.onWallets(callback)
			registry.addWallet(mockWallet1)

			expect(callback).toHaveBeenCalled()
		})

		it('onWallets() should return an unsubscribe function', () => {
			const callback = vi.fn()

			const unsubscribe = registry.onWallets(callback)

			expect(typeof unsubscribe).toBe('function')
		})

		it('onWallets() callback should be triggered when addWallet() is called', () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			registry.addWallet(mockWallet1)

			expect(callback).toHaveBeenCalledWith([mockWallet1])
		})

		it('onWallets() callback should be triggered when setWallets() is called', () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			registry.setWallets([mockWallet1, mockWallet2])

			expect(callback).toHaveBeenCalledWith([mockWallet1, mockWallet2])
		})

		it('Multiple onWallets() callbacks should all be triggered', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()
			const callback3 = vi.fn()

			registry.onWallets(callback1)
			registry.onWallets(callback2)
			registry.onWallets(callback3)

			registry.addWallet(mockWallet1)

			expect(callback1).toHaveBeenCalled()
			expect(callback2).toHaveBeenCalled()
			expect(callback3).toHaveBeenCalled()
		})

		it('Unsubscribe function should remove the specific callback', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			registry.onWallets(callback1)
			const unsubscribe = registry.onWallets(callback2)

			unsubscribe()

			registry.addWallet(mockWallet1)

			expect(callback1).toHaveBeenCalled()
			expect(callback2).not.toHaveBeenCalled()
		})
	})

	describe('AddWallet', () => {
		it('addWallet() should add a wallet to the wallets array', () => {
			registry.addWallet(mockWallet1)

			expect(registry.getWallets()).toContain(mockWallet1)
		})

		it('addWallet() should append wallet to existing wallets (not replace)', () => {
			registry.addWallet(mockWallet1)
			registry.addWallet(mockWallet2)

			const wallets = registry.getWallets()

			expect(wallets).toHaveLength(2)
			expect(wallets).toContain(mockWallet1)
			expect(wallets).toContain(mockWallet2)
		})

		it("addWallet() should emit 'wallets' event with updated array", () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			registry.addWallet(mockWallet1)

			expect(callback).toHaveBeenCalledWith([mockWallet1])

			registry.addWallet(mockWallet2)

			expect(callback).toHaveBeenCalledWith([mockWallet1, mockWallet2])
		})

		it('addWallet() should trigger all registered callbacks', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			registry.onWallets(callback1)
			registry.onWallets(callback2)

			registry.addWallet(mockWallet1)

			expect(callback1).toHaveBeenCalledWith([mockWallet1])
			expect(callback2).toHaveBeenCalledWith([mockWallet1])
		})
	})

	describe('SetWallets', () => {
		it('setWallets() should replace the entire wallets array', () => {
			registry.addWallet(mockWallet1)

			registry.setWallets([mockWallet2])

			const wallets = registry.getWallets()
			expect(wallets).toEqual([mockWallet2])
			expect(wallets).not.toContain(mockWallet1)
		})

		it("setWallets() should emit 'wallets' event with new array", () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			registry.setWallets([mockWallet1, mockWallet2])

			expect(callback).toHaveBeenCalledWith([mockWallet1, mockWallet2])
		})

		it('setWallets() should trigger all registered callbacks', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			registry.onWallets(callback1)
			registry.onWallets(callback2)

			registry.setWallets([mockWallet1, mockWallet2])

			expect(callback1).toHaveBeenCalledWith([mockWallet1, mockWallet2])
			expect(callback2).toHaveBeenCalledWith([mockWallet1, mockWallet2])
		})

		it('setWallets() with empty array should clear all wallets', () => {
			registry.addWallet(mockWallet1)
			registry.addWallet(mockWallet2)

			registry.setWallets([])

			expect(registry.getWallets()).toEqual([])
		})
	})

	describe('ClearAllListeners', () => {
		it('clearAllListeners() should clear all event emitter listeners', () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			registry.clearAllListeners()

			registry.addWallet(mockWallet1)

			expect(callback).not.toHaveBeenCalled()
		})

		it('clearAllListeners() should call abstract stopListeners() method', () => {
			registry.clearAllListeners()

			expect(registry.getStopListenersCalled()).toBe(true)
		})

		it('After clearAllListeners(), onWallets() callbacks should not be triggered', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			registry.onWallets(callback1)
			registry.onWallets(callback2)

			registry.clearAllListeners()

			registry.addWallet(mockWallet1)

			expect(callback1).not.toHaveBeenCalled()
			expect(callback2).not.toHaveBeenCalled()
		})

		it('clearAllListeners() should be idempotent (safe to call multiple times)', () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			registry.clearAllListeners()
			registry.clearAllListeners()
			registry.clearAllListeners()

			registry.addWallet(mockWallet1)

			expect(callback).not.toHaveBeenCalled()
			expect(registry.getStopListenersCalled()).toBe(true)
		})
	})

	describe('Abstract Methods (Implementation Testing)', () => {
		it('Concrete implementation should define wallets property', () => {
			expect(registry.getWallets()).toBeDefined()
			expect(Array.isArray(registry.getWallets())).toBe(true)
		})

		it('Concrete implementation should define start() method', () => {
			// TestRegistry has start() method implemented
			expect(registry.getStartCalled).toBeDefined()
			expect(typeof registry.getStartCalled).toBe('function')
		})

		it('Concrete implementation should define stopListeners() method', () => {
			registry.clearAllListeners()

			// stopListeners() should have been called
			expect(registry.getStopListenersCalled()).toBe(true)
		})
	})

	describe('Integration Tests', () => {
		it('should handle complex workflow: add, set, and clear', () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			// Add wallets
			registry.addWallet(mockWallet1)
			expect(callback).toHaveBeenCalledWith([mockWallet1])
			expect(registry.getWallets()).toHaveLength(1)

			callback.mockClear()

			// Add another wallet
			registry.addWallet(mockWallet2)
			expect(callback).toHaveBeenCalledWith([mockWallet1, mockWallet2])
			expect(registry.getWallets()).toHaveLength(2)

			callback.mockClear()

			// Replace all wallets
			const mockWallet3 = createMockNamespaceWallet('wallet3', 'eip155' as NamespaceId)
			registry.setWallets([mockWallet3])
			expect(callback).toHaveBeenCalledWith([mockWallet3])
			expect(registry.getWallets()).toEqual([mockWallet3])

			callback.mockClear()

			// Clear listeners
			registry.clearAllListeners()
			registry.addWallet(mockWallet1)
			expect(callback).not.toHaveBeenCalled()
		})

		it('should maintain separate wallet arrays for different registry instances', () => {
			const registry2 = new TestRegistry()

			registry.addWallet(mockWallet1)
			registry2.addWallet(mockWallet2)

			expect(registry.getWallets()).toEqual([mockWallet1])
			expect(registry2.getWallets()).toEqual([mockWallet2])
		})

		it('should handle rapid successive updates', () => {
			const callback = vi.fn()
			registry.onWallets(callback)

			// Rapidly add multiple wallets
			registry.addWallet(mockWallet1)
			registry.addWallet(mockWallet2)
			const mockWallet3 = createMockNamespaceWallet('wallet3', 'eip155' as NamespaceId)
			registry.addWallet(mockWallet3)

			expect(callback).toHaveBeenCalledTimes(3)
			expect(registry.getWallets()).toHaveLength(3)
		})

		it('should handle unsubscribe during event emission', () => {
			const callback1 = vi.fn()
			let unsubscribe2: () => void

			const callback2 = vi.fn(() => {
				// Unsubscribe during callback execution
				unsubscribe2()
			})

			registry.onWallets(callback1)
			unsubscribe2 = registry.onWallets(callback2)

			registry.addWallet(mockWallet1)

			// Both should be called on first emission
			expect(callback1).toHaveBeenCalled()
			expect(callback2).toHaveBeenCalled()

			callback1.mockClear()
			callback2.mockClear()

			// Add another wallet
			registry.addWallet(mockWallet2)

			// Only callback1 should be called (callback2 unsubscribed)
			expect(callback1).toHaveBeenCalled()
			expect(callback2).not.toHaveBeenCalled()
		})
	})
})
