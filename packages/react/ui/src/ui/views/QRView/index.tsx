import { QRViewLogic } from '@trustwallet/connect-ui-logic/walletConnect'
import { QRWrapper } from './components/QRWrapper'
import { QRPlaceholder } from './components/QRPlaceholder'
import { QRActions } from './components/QRActions'
import { QRButton } from './components/QRButton'
import { QRError } from './components/QRError'
import { Cuer } from 'cuer'
import { Spinner } from '../../icons/Spinner'

export function QRView() {
	return (
		<QRViewLogic
			components={{
				wrapper: QRWrapper,
				placeholder: QRPlaceholder,
				qrCode: Cuer,
				actions: QRActions,
				button: QRButton,
				error: QRError,
				spinner: Spinner,
			}}
		/>
	)
}
