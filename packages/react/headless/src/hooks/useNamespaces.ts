import { useMemo } from 'react'
import { useTrustConnectContext } from '../context'

export function useNamespaces() {
	const { client } = useTrustConnectContext()
	const namespaces = useMemo(() => client.getNamespaces(), [client])

	return { namespaces }
}
