/**
 * Browser-only encoding/decoding utilities
 * Focus: Performance, Memory Efficiency & Strict Validation
 */

const HEX_TABLE = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

// --- HEX ---

export function bytesToHex(bytes: Uint8Array): string {
	const out = new Array(bytes.length)
	for (let i = 0; i < bytes.length; i++) {
		out[i] = HEX_TABLE[bytes[i]]
	}
	return out.join('')
}

export function hexToBytes(hex: string): Uint8Array {
	const cleanHex = hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex

	if (cleanHex.length % 2 !== 0) throw new Error('Invalid hex string: odd length')
	if (!/^[0-9a-fA-F]*$/.test(cleanHex)) throw new Error('Invalid hex string: invalid chars')

	const out = new Uint8Array(cleanHex.length / 2)
	for (let i = 0; i < out.length; i++) {
		out[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16)
	}
	return out
}

// --- BASE64 & BASE64URL ---

export function bytesToBase64(bytes: Uint8Array): string {
	const CHUNK_SIZE = 8192
	const parts: string[] = []
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		const chunk = bytes.subarray(i, i + CHUNK_SIZE)
		parts.push(String.fromCharCode(...chunk))
	}
	return btoa(parts.join(''))
}

export function base64ToBytes(base64: string): Uint8Array {
	const binary = window.atob(base64)
	const bytes = new Uint8Array(binary.length)
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i)
	}
	return bytes
}

export function bytesToBase64Url(bytes: Uint8Array): string {
	return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function base64UrlToBytes(base64url: string): Uint8Array {
	if (/\s/.test(base64url)) throw new Error('Invalid base64url: contains whitespace')
	if (base64url !== '' && !/^[A-Za-z0-9\-_]+$/.test(base64url)) throw new Error('Invalid base64url: invalid chars')

	let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
	if (base64.length % 4 === 1) throw new Error('Invalid base64url: invalid length')

	const padding = (4 - (base64.length % 4)) % 4
	base64 += '='.repeat(padding)
	return base64ToBytes(base64)
}

// --- BASE58 ---

export function bytesToBase58(bytes: Uint8Array): string {
	if (bytes.length === 0) return ''

	let zeros = 0
	while (zeros < bytes.length && bytes[zeros] === 0) zeros++

	let num = 0n
	// Optimization: Skip leading zeros in calculation
	for (let i = zeros; i < bytes.length; i++) {
		num = num * 256n + BigInt(bytes[i])
	}

	const chars: string[] = []
	while (num > 0n) {
		chars.push(BASE58_ALPHABET[Number(num % 58n)])
		num /= 58n
	}

	return '1'.repeat(zeros) + chars.reverse().join('')
}

export function base58ToBytes(base58: string): Uint8Array {
	if (base58.length === 0) return new Uint8Array(0)

	let zeros = 0
	while (zeros < base58.length && base58[zeros] === '1') zeros++

	let num = 0n
	for (let i = zeros; i < base58.length; i++) {
		const digit = BASE58_ALPHABET.indexOf(base58[i])
		if (digit < 0) throw new Error(`Invalid base58 character: ${base58[i]}`)
		num = num * 58n + BigInt(digit)
	}

	const tmp: number[] = []
	while (num > 0n) {
		tmp.push(Number(num % 256n))
		num /= 256n
	}
	tmp.reverse()

	const out = new Uint8Array(zeros + tmp.length)
	out.set(tmp, zeros)
	return out
}

// --- CONVERTERS ---

export const base64ToHex = (base64: string): string => bytesToHex(base64ToBytes(base64))
export const hexToBase64 = (hex: string): string => bytesToBase64(hexToBytes(hex))

// --- UTF-8 ---

export const stringToBytes = (str: string): Uint8Array => new TextEncoder().encode(str)
export const bytesToString = (bytes: Uint8Array): string => new TextDecoder().decode(bytes)
