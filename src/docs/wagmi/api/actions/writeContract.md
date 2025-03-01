
# writeContract

Action for executing a write function on a contract.

A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, hence a transaction is broadcasted in order to change the state.

## Import

```ts
import { writeContract } from '@wagmi/core'
```

## Usage

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

::::tip Pairing with `simulateContract`

Pairing [`simulateContract`](/core/api/actions/simulateContract) with `writeContract` allows you to validate if the transaction will succeed ahead of time. If the simulate succeeds, `writeContract` can execute the transaction.

::: code-group
```ts [index.ts]
import { simulateContract, writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const { request } = await simulateContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
})
const hash = await writeContract(config, request)
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::
::::


## Parameters

```ts
import { type WriteContractParameters } from '@wagmi/core'
```

### abi

`Abi`

The contract's ABI. Check out the [TypeScript docs](/react/typescript#const-assert-abis-typed-data) for how to set up ABIs for maximum type inference and safety.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi' // [!code focus]
import { config } from './config'

const result = await writeContract(config, {
  abi, // [!code focus]
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### accessList

`AccessList | undefined`

The access list.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  accessList: [{ // [!code focus]
    address: '0x1', // [!code focus]
    storageKeys: ['0x1'], // [!code focus]
  }], // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### account

`Address | Account | undefined`

Account to use when signing data. Throws if account is not found on [`connector`](#connector).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  account: '0xd2135CfB216b74109775236E36d4b433F1DF507B', // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### address

`Address`

The contract's address.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f', // [!code focus]
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::


### args

`readonly unknown[] | undefined`

- Arguments to pass when calling the contract.
- Inferred from [`abi`](#abi) and [`functionName`](#functionname).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [ // [!code focus]
    '0xd2135CfB216b74109775236E36d4b433F1DF507B', // [!code focus]
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', // [!code focus]
    123n, // [!code focus]
  ] // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### chainId

`config['chains'][number]['id'] | undefined`

Chain ID to validate against before sending transaction.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { mainnet } from 'wagmi/chains' // [!code focus]
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  chainId: mainnet.id, // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### connector

`Connector | undefined`

[Connector](/core/api/connectors) to sign data with.

::: code-group
```ts [index.ts]
import { getAccount, writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const { connector } = getAccount(config)
const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  connector, // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### dataSuffix

`` `0x${string}` | undefined ``

Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { parseGwei } from 'viem'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  dataSuffix: '0xdeadbeef', // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### functionName

`string`

- Function to call on the contract.
- Inferred from [`abi`](#abi).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'approve', // [!code focus]
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 123n]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::


### gas

`bigint | undefined`

Gas provided for transaction execution.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { parseGwei } from 'viem'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  gas: parseGwei('20'), // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

---

### gasPrice

`bigint | undefined`

The price in wei to pay per gas. Only applies to [Legacy Transactions](https://viem.sh/docs/glossary/terms.html#legacy-transaction).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { parseGwei } from 'viem'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  gasPrice: parseGwei('20'), // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### maxFeePerGas

`bigint | undefined`

Total fee per gas in wei, inclusive of [`maxPriorityFeePerGas`](#maxPriorityFeePerGas). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms.html#eip-1559-transaction).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { parseGwei } from 'viem'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  maxFeePerGas: parseGwei('20'), // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### maxPriorityFeePerGas

`bigint | undefined`

Max priority fee per gas in wei. Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms.html#eip-1559-transaction).

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { parseGwei } from 'viem'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

---

### nonce

`number`

Unique number identifying this transaction.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  nonce: 123, // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### type

`'legacy' | 'eip1559' | 'eip2930' | undefined`

Optional transaction request type to narrow parameters.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  type: 'eip1559', // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

### value

`bigint | undefined`

Value in wei sent with this transaction.

::: code-group
```ts [index.ts]
import { writeContract } from '@wagmi/core'
import { parseEther } from 'viem'
import { abi } from './abi'
import { config } from './config'

const result = await writeContract(config, {
  abi,
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  functionName: 'transferFrom',
  args: [
    '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    123n,
  ],
  value: parseEther('0.01'), // [!code focus]
})
```
<<< @/snippets/abi-write.ts[abi.ts]
<<< @/snippets/core/config.ts[config.ts]
:::

## Return Type

```ts
import { type WriteContractReturnType } from '@wagmi/core'
```

[`Hash`](https://viem.sh/docs/glossary/types.html#hash)

The transaction hash.

## Type Inference

With [`abi`](#abi) setup correctly, TypeScript will infer the correct types for [`functionName`](#functionname), [`args`](#args), and [`value`](#value). See the Wagmi [TypeScript docs](/core/typescript) for more information.

## Error

```ts
import { type WriteContractErrorType } from '@wagmi/core'
```

<!--@include: @shared/mutation-imports.md-->

## Viem

- [`writeContract`](https://viem.sh/docs/contract/writeContract.html)
