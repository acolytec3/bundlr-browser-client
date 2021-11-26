# Bundlr Browser Client

A browser client for uploading data to the [Bundlr.Network](https://bundlr.network) with fees paid in Matic.

## Usage

Instantiate an [ethers web3provider](https://docs.ethers.io/v5/single-page/#/v5/api/providers/provider/)

Create a new client and connect:
```js

 const bundlr = new BundlrBrowserClient("https://node1.bundlr.network", provider);

await bundlr.connect()
```

Retrieve an account's balance with the bundlr node:
```js
bundler.getBundlrBalance(web3.account)
```

Fund an account on the bundlr node:
```js
bundler.fundMatic(BigNumber.from(100000))
```

Upload data to the bundlr network
```js
const res = await bundler!.uploadItem(img);
console.log(res);
```

See [API Reference](./docs/README.md) for full documentation