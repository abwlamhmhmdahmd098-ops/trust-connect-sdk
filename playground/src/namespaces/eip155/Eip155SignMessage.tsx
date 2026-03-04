import { useConnection } from '@trustwallet/connect-react'
import { useSignMessage } from '@trustwallet/connect-eip155-react'
import { ActionCard } from '../../components/ActionCard'

export function Eip155SignMessage() {
	const { isConnected } = useConnection({ namespaceId: 'eip155' })

	const { mutate: sign, data: signature, isPending, isSuccess, isError, error } = useSignMessage()

	const handleSign = () => {
		if (!isConnected) return
		const message = 'hello world'
		sign({ message })
	}

	return (
		<ActionCard eyebrow="Signature" title="Sign Message" copy="Test message signing with your connected wallet.">
			<button className="btn btn-primary" onClick={() => handleSign()} disabled={isPending || !isConnected}>
				{isPending ? 'Signing...' : 'Sign "hello world"'}
			</button>

			{isPending && (
				<div className="status-message pending">
					<span className="spinner"></span>
					Signing message...
				</div>
			)}

			{isSuccess && signature && (
				<div className="status-message success">
					Message successfully signed!
					<details className="signature-details">
						<summary>View Signature</summary>
						<code>{signature}</code>
					</details>
				</div>
			)}

			{isError && <div className="status-message error">Error: {error?.message}</div>}
		</ActionCard>
	)
}
