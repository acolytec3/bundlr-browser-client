[bundlr-browser-client](../README.md) / [Exports](../modules.md) / BundlrBrowserClient

# Class: BundlrBrowserClient

## Table of contents

### Constructors

- [constructor](BundlrBrowserClient.md#constructor)

### Properties

- [bundlerAddress](BundlrBrowserClient.md#bundleraddress)
- [provider](BundlrBrowserClient.md#provider)
- [signer](BundlrBrowserClient.md#signer)

### Methods

- [connect](BundlrBrowserClient.md#connect)
- [createTx](BundlrBrowserClient.md#createtx)
- [fundMatic](BundlrBrowserClient.md#fundmatic)
- [getBundlrBalance](BundlrBrowserClient.md#getbundlrbalance)
- [getPrice](BundlrBrowserClient.md#getprice)
- [uploadItem](BundlrBrowserClient.md#uploaditem)
- [withdraw](BundlrBrowserClient.md#withdraw)

## Constructors

### constructor

• **new BundlrBrowserClient**(`bundlerAddress`, `provider`)

Creates a new instance of the bundlrBrowserClient

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundlerAddress` | `string` | -- address of the bundlr.network node to connect to |
| `provider` | `Web3Provider` | any web3provider compatible with the `ethers.providers.Web3Provider` type |

#### Defined in

[bundler.ts:28](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L28)

## Properties

### bundlerAddress

• `Private` **bundlerAddress**: `string`

#### Defined in

[bundler.ts:18](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L18)

___

### provider

• `Private` **provider**: `Web3Provider`

#### Defined in

[bundler.ts:19](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L19)

___

### signer

• `Private` **signer**: `default`

#### Defined in

[bundler.ts:20](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L20)

## Methods

### connect

▸ **connect**(): `Promise`<`void`\>

Computes the public key for the address associated with a web3provider necessary for signing bundlr network transactions

#### Returns

`Promise`<`void`\>

#### Defined in

[bundler.ts:37](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L37)

___

### createTx

▸ **createTx**(`to`, `amount`): `Promise`<`TransactionRequest`\>

Creates a transaction to send MATIC tokens to another address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `to` | `string` | address to send MATIC tokens to |
| `amount` | `BigNumber` | amount of MATIC tokens to send |

#### Returns

`Promise`<`TransactionRequest`\>

an unsigned `ethers.providers.TransactionRequest`

#### Defined in

[bundler.ts:86](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L86)

___

### fundMatic

▸ **fundMatic**(`amount`): `Promise`<`number`\>

Creaes and sends a transaction to the bundlr.network node to fund data uploads

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `BigNumber` | amount to send to the bundlr network node |

#### Returns

`Promise`<`number`\>

a promise that resolves to the HTTP status code associated with funding an account on the bundlr.network node
status code 200 indicates an account was successfully funded

#### Defined in

[bundler.ts:100](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L100)

___

### getBundlrBalance

▸ **getBundlrBalance**(`address`): `Promise`<`BigNumber`\>

Retrieves the current MATIC balance associated with an account on the connected bundlr network node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | Ethereum/Polygon address (`0xabc...`) |

#### Returns

`Promise`<`BigNumber`\>

the current balance of the supplied `address` on the currently connected bundlr network node denominated in MATIC wei

#### Defined in

[bundler.ts:75](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L75)

___

### getPrice

▸ **getPrice**(`bytesSize`): `Promise`<`BigNumber`\>

Retrieves the current estimated price for uploading a specified number of bytes to the bundlr network in MATIC

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytesSize` | `number` | the number of bytes to be uploaded to the bundlr network |

#### Returns

`Promise`<`BigNumber`\>

the cost of uploading `bytesSize` ethers `BigNumber` denominated in MATIC wei (1/10^18 MATIC)

#### Defined in

[bundler.ts:55](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L55)

___

### uploadItem

▸ **uploadItem**(`data`, `tags`): `Promise`<`AxiosResponse`<`any`, `any`\>\>

Uploads data to the bundlr.network

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Buffer` | bytes to be uploaded to the bundlr.network |
| `tags` | [`Tag`](../modules.md#tag)[] | key value pairs |

#### Returns

`Promise`<`AxiosResponse`<`any`, `any`\>\>

an `AxiosResponse` object containing the status and statuscode indicating whether data was successfully uploaded or not

#### Defined in

[bundler.ts:125](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L125)

___

### withdraw

▸ **withdraw**(`amount`): `Promise`<`AxiosResponse`<`any`, `any`\>\>

Request withdrawal of funds deposited with bundler node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `BigNumber` | `Ethers BigNumber` representing the amount of the requested withdrawal |

#### Returns

`Promise`<`AxiosResponse`<`any`, `any`\>\>

`AxiosResponse` representing the success/failure of the request

#### Defined in

[bundler.ts:145](https://github.com/acolytec3/bundlr-browser-client/blob/d172eff/src/bundler.ts#L145)
