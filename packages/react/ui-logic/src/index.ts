// Context
export { TrustModalProvider, useTrustModal } from './context/TrustModalContext'
export type { TrustModalProviderProps, TrustModalContextValue, ModalView, ModalType } from './context/TrustModalContext'

// Hooks
export { useTheme } from './hooks/useTheme'
export type { Theme, ResolvedTheme } from './hooks/useTheme'
export { useCopyToClipboard } from './hooks/useCopyToClipboard'

// Utils
export { TRUST_WALLET } from '@trustwallet/connect-utils'

// UI Logic Components
export { TrustModalLogic } from './TrustModal'
export { WalletsViewLogic } from './views/WalletsView/WalletsViewLogic'
export { NamespaceViewLogic } from './views/NamespaceView/NamespaceViewLogic'
export { GetTrustButtonLogic } from './buttons/GetTrustButton/GetTrustButtonLogic'
export { FooterLogic } from './components/Footer/FooterLogic'

export {
	TrustConnectProvider,
	useWallets,
	useConnection,
	useConnections,
	useConnect,
	useNamespaces,
} from '@trustwallet/connect-headless'
export type {
	NamespaceId,
	TrustConnectOptions,
	TrustConnectProviderProps,
	Connections,
	RpcUrls,
} from '@trustwallet/connect-headless'
