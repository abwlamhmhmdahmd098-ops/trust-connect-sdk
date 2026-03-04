import { CaipWallet } from '../types'

export abstract class ServiceBase {
	abstract id: string
	abstract caipWallet: CaipWallet | undefined
}
