import { MobileWalletsViewLogic } from '@trustwallet/connect-ui-logic/walletConnect'
import { MobileEmptyState } from './components/MobileEmptyState'
import { MobileLoading } from './components/MobileLoading'
import { MobileSearch } from './components/MobileSearch'
import { MobileWalletsList } from './components/MobileWalletsList'
import { MobileWrapper } from './components/MobileWrapper'
import { Footer } from '../../components/Footer'

export function MobileWalletsView() {
	return (
		<MobileWalletsViewLogic
			components={{
				wrapper: MobileWrapper,
				search: MobileSearch,
				loading: MobileLoading,
				emptyState: MobileEmptyState,
				walletsList: MobileWalletsList,
				footer: Footer,
			}}
		/>
	)
}
