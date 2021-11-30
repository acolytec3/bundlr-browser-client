import { ethers, BigNumber } from 'ethers'
import axios, { AxiosResponse } from 'axios'
import { createData, deepHash, InjectedEthereumSigner } from 'arbundles';

export type Tag = {
    name: string,
    value: string
}

interface WithdrawalTx {
    publicKey: string | Buffer,
    currency: string,
    amount: string,
    nonce: number,
    signature: Buffer | Uint8Array
}
export class BundlrBrowserClient {
    private bundlerAddress: string
    private provider: ethers.providers.Web3Provider
    private signer: InjectedEthereumSigner

    /**
     *
     * Creates a new instance of the bundlrBrowserClient
     * @param bundlerAddress -- address of the bundlr.network node to connect to
     * @param provider any web3provider compatible with the `ethers.providers.Web3Provider` type
     */
    constructor(bundlerAddress: string, provider: ethers.providers.Web3Provider) {
        this.bundlerAddress = bundlerAddress
        this.provider = provider
        this.signer = new InjectedEthereumSigner(this.provider);
    }

    /**
     * Computes the public key for the address associated with a web3provider necessary for signing bundlr network transactions
     */
    connect = async () => {
        try {
            await this.signer.setPublicKey()
            if (!this.signer.publicKey) {
                console.log('no key generated')
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    /**
     *
     * Retrieves the current estimated price for uploading a specified number of bytes to the bundlr network in MATIC
     * @param bytesSize the number of bytes to be uploaded to the bundlr network
     * @returns the cost of uploading `bytesSize` ethers `BigNumber` denominated in MATIC wei (1/10^18 MATIC)
     */
    getPrice = async (bytesSize: number): Promise<BigNumber> => {
        const res = await axios.get(`${this.bundlerAddress}/price/matic/${bytesSize}`)
        try {
            const price = BigNumber.from(res.data)
            return price
        } catch {
            const decimalPrice = res.data.split('.')
            if (decimalPrice.length > 1) {
                return BigNumber.from(decimalPrice[0])
            } else {
                return BigNumber.from(0)
            }
        }
    }

    /**
     * Retrieves the current MATIC balance associated with an account on the connected bundlr network node
     * @param address Ethereum/Polygon address (`0xabc...`)
     * @returns the current balance of the supplied `address` on the currently connected bundlr network node denominated in MATIC wei
     */
    getBundlrBalance = async (address: string): Promise<BigNumber> => {
        const res = await axios.get(`${this.bundlerAddress}/account/balance/matic?address=${address}`);
        return BigNumber.from(res.data.balance)
    }

    /**
     * Creates a transaction to send MATIC tokens to another address
     * @param to - address to send MATIC tokens to
     * @param amount - amount of MATIC tokens to send
     * @returns an unsigned `ethers.providers.TransactionRequest`
     */
    createTx = async (to: string, amount: BigNumber): Promise<ethers.providers.TransactionRequest> => {
        const estimatedGas = await this.provider.estimateGas({ to, value: amount.toHexString() })
        const gasPrice = await this.provider.getGasPrice();
        const signer = await this.provider.getSigner();
        const tx = await signer.populateTransaction({ to, value: amount.toHexString(), gasPrice, gasLimit: estimatedGas })
        return tx;
    }

    /**
     * Creaes and sends a transaction to the bundlr.network node to fund data uploads
     * @param amount - amount to send to the bundlr network node
     * @returns a promise that resolves to the HTTP status code associated with funding an account on the bundlr.network node
     * status code 200 indicates an account was successfully funded
     */
    fundMatic = async (amount: BigNumber): Promise<number> => {
        const bundlrAddress = await (await axios.get(`${this.bundlerAddress}/info`)).data.addresses.matic;

        const tx = await this.createTx(
            bundlrAddress,
            amount,
        );
        const signer = await this.provider.getSigner();
        const txResp = await signer!.sendTransaction(tx);
        await txResp.wait();
        const res = await axios.post(
            `${this.bundlerAddress}/account/balance/matic`,
            {
                tx_id: txResp.hash,
            }
        );
        return res.status;
    };

    /**
     * Uploads data to the bundlr.network
     * @param data bytes to be uploaded to the bundlr.network
     * @param tags key value pairs
     * @returns an `AxiosResponse` object containing the status and statuscode indicating whether data was successfully uploaded or not 
     */
    uploadItem = async (data: Buffer, tags: Tag[]): Promise<AxiosResponse> => {
        const item = createData(data, this.signer, { tags });
        await item.sign(this.signer);
        const res = await axios.post(`${this.bundlerAddress}/tx/matic`, item.getRaw(), {
            headers: { "Content-Type": "application/octet-stream", 'Access-Control-Allow-Origin': '*', },
            timeout: 100000,
            maxBodyLength: Infinity,
            validateStatus: (status: any) => (status > 200 && status < 300) || status !== 402
        })
        if (res.status === 402) {
            throw new Error("not enough funds to send data")
        }
        return res
    }

    /**
     * Request withdrawal of funds deposited with bundler node
     * @param amount `Ethers BigNumber` representing the amount of the requested withdrawal
     * @returns `AxiosResponse` representing the success/failure of the request
     */
    withdraw = async (amount: BigNumber): Promise<AxiosResponse> => {
        const res = await axios.get(`${this.bundlerAddress}/account/withdrawals/matic?address=${ethers.utils.computeAddress(this.signer.publicKey)}`);
        const data = { publicKey: await this.signer.publicKey, currency: "matic", amount: amount.toString(), nonce: res.data } as WithdrawalTx;
        const deephash = await deepHash([stringToBuffer(data.currency), stringToBuffer(data.amount.toString()), stringToBuffer(data.nonce.toString())]);
        data.signature = await this.signer.sign(deephash)
        return axios.post(`${this.bundlerAddress}/account/withdraw`, data);
    }
}

function stringToBuffer(data: string) {
    // TextEncoder will be available in browsers, but not in node
    if (typeof TextEncoder == "undefined") {
        const TextEncoder = require("util").TextEncoder;
        return new TextEncoder().encode(data);
    }
    return new TextEncoder().encode(data);
}