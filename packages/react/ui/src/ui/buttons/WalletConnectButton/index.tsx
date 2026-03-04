import { WalletConnectButtonLogic } from '@trustwallet/connect-ui-logic/walletConnect'
import { WalletButton } from '../WalletButton'
import { WCTitle } from './components/WCTitle'
import { WCGrid } from './components/WCGrid'

export function WalletConnectButton() {
	return (
		<WalletConnectButtonLogic
			components={{
				title: WCTitle,
				grid: WCGrid,
				walletButton: WalletButton,
			}}
		/>
	)
}
