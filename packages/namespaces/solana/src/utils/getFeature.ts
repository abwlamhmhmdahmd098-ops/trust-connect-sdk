import { IdentifierString, WalletStandardWallet } from '../types/wallet-standard'

export function getFeature<T>(wallet: WalletStandardWallet, key: IdentifierString): T | undefined {
	return wallet.features?.[key] as T | undefined
}
