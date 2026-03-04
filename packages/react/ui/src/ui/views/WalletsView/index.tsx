import { WalletsViewLogic } from '@trustwallet/connect-ui-logic'
import { WalletButton } from '../../buttons/WalletButton'
import { WalletConnectButton } from '../../buttons/WalletConnectButton'
import { GetTrustButton } from '../../buttons/GetTrustButton'
import { WalletsHeader } from './components/WalletsHeader'
import { WalletsGrid } from './components/WalletsGrid'

export function WalletsView() {
	return (
		<WalletsViewLogic
			components={{
				emptyState: GetTrustButton,
				header: WalletsHeader,
				grid: WalletsGrid,
				walletButton: WalletButton,
				walletConnectButton: WalletConnectButton,
			}}
		/>
	)
}
