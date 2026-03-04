/**
 * Namespace Specifications
 * This interface can be augmented by namespace packages to register their types.
 *
 * @example
 * ```typescript
 * declare module '@trustwallet/connect-core' {
 *   interface NamespaceSpecs {
 *     eip155: {
 *       provider: EIP155Provider
 *       address: Address
 *       chain: ChainReference
 *     }
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NamespaceSpecs {}
