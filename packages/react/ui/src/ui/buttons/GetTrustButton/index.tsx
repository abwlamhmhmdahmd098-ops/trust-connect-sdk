import { GetTrustButtonLogic } from '@trustwallet/connect-ui-logic'
import { GetTrustWrapper } from './components/GetTrustWrapper'
import { GetTrustMessage } from './components/GetTrustMessage'
import { WalletButton } from '../WalletButton'

interface GetTrustButtonProps {
	message?: string
}

export function GetTrustButton({ message }: GetTrustButtonProps) {
	return (
		<GetTrustButtonLogic
			message={message}
			components={{
				wrapper: GetTrustWrapper,
				message: GetTrustMessage,
				walletButton: WalletButton,
			}}
		/>
	)
}
