import { useConnection } from '@trustwallet/connect-react'
import { useSignMessage } from '@trustwallet/connect-solana-react'
import { ActionCard } from '../../components/ActionCard'
import bs58 from 'bs58'

export function SolanaSignMessage() {
	const { isConnected } = useConnection({ namespaceId: 'solana' })

	const { mutate: sign, data, isPending, isSuccess, isError, error } = useSignMessage()

	const handleSign = () => {
		if (!isConnected) return
		sign({
			message: 'hello world',
		})
	}

	// Convert Uint8Array signature to hex for display
	// Note: signature now contains signedMessage, signature, and optional signatureType
	const signatureHex = data ? bs58.encode(data.signature) : null

	return (
		<ActionCard eyebrow="Signature" title="Sign Message" copy="Test message signing with your connected Solana wallet.">
			<button className="btn btn-primary" onClick={() => handleSign()} disabled={isPending || !isConnected}>
				{isPending ? 'Signing...' : 'Sign "hello world"'}
			</button>

			{isPending && (
				<div className="status-message pending">
					<span className="spinner"></span>
					Signing message...
				</div>
			)}

			{isSuccess && signatureHex && (
				<div className="status-message success">
					Message successfully signed!
					<details className="signature-details">
						<summary>View Signature</summary>
						<code>{signatureHex}</code>
					</details>
				</div>
			)}

			{isError && <div className="status-message error">Error: {error?.message}</div>}
		</ActionCard>
	)
}
