import type { Hex } from '../../utils/hex'
import type { EIP155Address } from '../../address'

export type PersonalSignMethod = 'personal_sign'
export type PersonalSignParams = [message: string, account: EIP155Address]
export type PersonalSignResponse = Hex
