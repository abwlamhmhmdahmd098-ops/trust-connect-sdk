import { Eip155SignMessage } from './Eip155SignMessage'
import { Eip155Balance } from './Eip155Balance'

export function Eip155Actions() {
	return (
		<div className="action-grid">
			<Eip155SignMessage />
			<Eip155Balance />
		</div>
	)
}
