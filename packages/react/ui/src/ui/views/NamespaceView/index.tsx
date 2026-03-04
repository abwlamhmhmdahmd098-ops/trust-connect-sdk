import { NamespaceViewLogic } from '@trustwallet/connect-ui-logic'
import { NamespaceButton } from '../../buttons/NamespaceButton'
import { NamespaceHeader } from './components/NamespaceHeader'
import { NamespaceGrid } from './components/NamespaceGrid'

export function NamespaceView() {
	return (
		<NamespaceViewLogic
			components={{
				header: NamespaceHeader,
				grid: NamespaceGrid,
				namespaceButton: NamespaceButton,
			}}
		/>
	)
}
