# TrustConnect SDK (Alpha)

A [CAIP](https://chainagnostic.org/)-native, multi-chain wallet connection SDK.

Networks are identified via [CAIP-2](https://chainagnostic.org/CAIPs/caip-2) `<namespace>:<reference>`, where the [`namespace`](https://namespaces.chainagnostic.org/) defines the ecosystem (e.g., eip155, solana, bip122) and the `reference` identifies a specific network within that ecosystem (e.g., 1 for Ethereum mainnet). By standardizing identifiers and session scope around CAIP primitives, the SDK provides a consistent integration surface across heterogeneous chains and remains forward-compatible as new namespaces emerge.
