import type { Hex } from '../../utils/hex'
import type { EIP155Address } from '../../address'

export type EthSignTypedDataMethod = 'eth_signTypedData' | 'eth_signTypedData_v4'
export type EthSignTypedDataParams = [account: EIP155Address, typedData: string]
export type EthSignTypedDataResponse = Hex
