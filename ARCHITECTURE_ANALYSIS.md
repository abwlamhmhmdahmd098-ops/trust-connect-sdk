# TrustConnect SDK - Architecture Analysis & Recommendations

**Analysis Date**: 2025-12-30
**SDK Version**: 0.0.0-alpha.11

## Architecture Overview

### High-Level Architecture

```
                         ┌─────────────────────────┐
                         │   User Application      │
                         │ (React/Svelte/Vanilla)  │
                         └───────────┬─────────────┘
                                     │
                    ┌────────────────┴───────────────┐
                    │                                │
         ┌──────────▼──────────┐          ┌──────────▼──────────┐
         │  React Hooks Layer  │          │   Core SDK Layer    │
         │  (Optional)         │          │   (Framework-agno)  │
         ├─────────────────────┤          ├─────────────────────┤
         │ @trustwallet/       │          │ TrustConnect        │
         │ connect-headless    │◄─────────┤   - Orchestrator    │
         │                     │          │   - Event system    │
         │ @trustwallet/       │          │   - State manager   │
         │ connect-eip155-     │          │                     │
         │ react               │          └──────────┬──────────┘
         │                     │                     │
         │ @trustwallet/       │          ┌──────────┴─────┐
         │ connect-solana-     │          │                │
         │ react               │     ┌────▼─────┐    ┌─────▼────┐
         └─────────────────────┘     │Namespace │    │ Service  │
                                     │ Engines  │    │  Layer   │
                                     ├──────────┤    ├──────────┤
                    ┌────────────────┤          │    │          │
                    │                │ EIP155   │    │Wallet    │
         ┌──────────▼──────────┐     │ Solana   │    │Connect   │
         │  Wallet Discovery   │     │ Bitcoin  │    │          │
         │  (Registries)       │     │ TON      │    │          │
         ├─────────────────────┤     └───┬──────┘    └─────┬────┘
         │ EIP-6963 Events     │         │                 │
         │ Wallet Standard     │    ┌────▼─────────────────▼───┐
         │ Custom protocols    │    │   Wallet Adapters        │
         └─────────┬───────────┘    │   (Unified interface)    │
                   │                ├──────────────────────────┤
                   │                │ EIP155Wallet             │
                   └───────────────►│ SolanaStandardWallet     │
                                    │ WalletConnectAdapter     │
                                    └──────────┬───────────────┘
                                               │
                                    ┌──────────▼───────────┐
                                    │  Browser Wallets     │
                                    │  (MetaMask, Phantom, │
                                    │   Trust Wallet, etc) │
                                    └──────────────────────┘
```

### Data Flow Sequence

```
1. Initialization
   User App
     → TrustConnect.constructor({ namespaces, services })
     → Creates NamespaceEngines for each namespace
     → Creates Services (WalletConnect)
     → Creates CaipController
     → Starts wallet discovery (registries)

2. Wallet Discovery
   Browser Extension
     → Emits discovery event (EIP-6963, Wallet Standard)
     → Registry catches event
     → Creates WalletAdapter
     → Emits to NamespaceEngine
     → NamespaceEngine aggregates wallets
     → TrustConnect computes multi-namespace wallets
     → React hooks re-render (useSyncExternalStore)

3. Connection (Namespace wallet)
   User clicks connect
     → useConnect.connect(wallet)
     → TrustConnect.connect({ wallet })
     → NamespaceEngine.connect(wallet)
     → wallet.__internal.connect()
     → Returns { address, chain }
     → NamespaceEngine.setConnection({ status: 'connected', ... })
     → Emits 'connection' event
     → TrustConnect propagates event
     → React hooks re-render
     → Storage saves last connected wallet

4. Connection (CAIP wallet - WalletConnect)
   User connects WalletConnect
     → CaipController.connect(wcWallet)
     → WalletConnectWalletAdapter.connect()
     → Builds optionalNamespaces (with scope interceptors)
     → SignClient.connect()
     → User scans QR code
     → Returns CaipSessionResponse
     → CaipController.setConnections()
     → Updates each NamespaceEngine
     → Events cascade through system

5. RPC Request (EIP155)
   useEIP155Mutation({ action: sendTransaction })
     → Gets provider from wallet
     → Executes Viem action
     → Returns result

6. RPC Request (Solana via WalletConnect)
   useSendTransaction.mutate({ transaction })
     → SolanaProvider.request({ method: 'signAndSendTransaction' })
     → interceptSolanaRequests()
     → Normalizes chainId (mainnet → full CAIP-2)
     → Converts params to WalletConnect format
     → SignClient.request()
     → Returns signature

7. Disconnection
   User clicks disconnect
     → TrustConnect.disconnect()
     → For namespace wallets: NamespaceEngine.disconnect()
     → For CAIP wallets: CaipController.disconnect()
     → wallet.__internal.disconnect()
     → Clears storage
     → Emits events
     → React hooks re-render
```