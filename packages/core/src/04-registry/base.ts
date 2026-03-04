import type { WalletAdapterBase } from '../05-wallet/base'
import { Emitter } from '../utils/emitter'

/**
 * Base class for registries that manage wallet discovery for a specific namespace.
 */
export abstract class RegistryBase<TWallet extends WalletAdapterBase = WalletAdapterBase> {
	protected abstract wallets: TWallet[]
	protected abstract start(opts?: unknown): Promise<void> | void
	protected abstract stopListeners(): void
	private events = new Emitter<{ wallets: TWallet[] }>()

	getWallets(): TWallet[] {
		return this.wallets
	}

	onWallets(cb: (wallets: TWallet[]) => void) {
		return this.events.on('wallets', cb)
	}

	addWallet(wallet: TWallet): void {
		this.wallets.push(wallet)
		this.events.emit('wallets', this.wallets)
	}

	setWallets(wallets: TWallet[]) {
		this.wallets = wallets
		this.events.emit('wallets', this.wallets)
	}

	clearAllListeners(): void {
		this.events.clear()
		this.stopListeners()
	}
}
