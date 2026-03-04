export function stringToWalletId(value: string) {
	return value.toLowerCase().split(/\s+/)[0]
}
