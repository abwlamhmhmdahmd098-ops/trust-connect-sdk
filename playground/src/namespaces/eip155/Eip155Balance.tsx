import { useConnection } from '@trustwallet/connect-react'
import { useEIP155Query } from '@trustwallet/connect-eip155-react'
import { getBalance } from 'viem/actions'
import { formatEther, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { ActionCard } from '../../components/ActionCard'

export function Eip155Balance() {
	const { address, isConnected } = useConnection({ namespaceId: 'eip155' })

	const {
		data: balance,
		isLoading,
		isError,
		error,
		refetch,
	} = useEIP155Query({
		chain: mainnet,
		action: getBalance,
		request: { address: address as Address },
		queryOptions: {
			enabled: isConnected,
			queryKey: [address],
		},
	})

	return (
		<ActionCard eyebrow="Balance" title="Read Balance" copy="Check the native token balance of your connected wallet.">
			<button className="btn btn-primary" onClick={() => refetch()} disabled={isLoading || !isConnected}>
				{isLoading ? 'Loading...' : 'Refresh Balance'}
			</button>

			{isLoading && (
				<div className="status-message pending">
					<span className="spinner"></span>
					Loading balance...
				</div>
			)}

			{balance !== undefined && !isLoading && (
				<div className="status-message success">
					Balance: {formatEther(balance)} ETH
					<details className="signature-details">
						<summary>View Raw Balance</summary>
						<code>{balance.toString()} wei</code>
					</details>
				</div>
			)}

			{isError && <div className="status-message error">Error: {error?.message}</div>}
		</ActionCard>
	)
}
