import { useMemo } from 'react'
import { useTrustConnectContext } from '@trustwallet/connect-headless'
import type { WalletConnectService } from '../../service/service'
import { WALLETCONNECT_WALLET } from '../../constants'

/**
 * Internal hook to get the WalletConnect service instance
 * @returns WalletConnectService instance or undefined if not configured
 */
export function useWalletConnectService(): WalletConnectService | undefined {
	const { client } = useTrustConnectContext()

	return useMemo(() => {
		const services = client.getServices()
		return services.find((service) => service.id === WALLETCONNECT_WALLET.ID) as WalletConnectService | undefined
	}, [client])
}
