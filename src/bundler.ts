import { ethers, BigNumber } from 'ethers'
import axios from 'axios'
import { createData, InjectedEthereumSigner } from 'arbundles';

export class Bundler {
    private bundlerAddress: string
    private provider: ethers.providers.Web3Provider

    constructor(bundlerAddress: string, provider: ethers.providers.Web3Provider) {
        this.bundlerAddress = bundlerAddress
        this.provider = provider
    }

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

    getBundlrBalance = async (address: string): Promise<BigNumber> => {
        const balanceResponse = await (await fetch(`${this.bundlerAddress}/account/balance/matic?address=${address}`)).json();
        return BigNumber.from(balanceResponse.balance)
    }

    createTx = async (to: string, amount: BigNumber): Promise<ethers.providers.TransactionRequest> => {
        const estimatedGas = await this.provider.estimateGas({ to, value: amount.toHexString() })
        const gasPrice = await this.provider.getGasPrice();
        const signer = await this.provider.getSigner();
        const tx = signer.populateTransaction({ to, value: amount.toHexString(), gasPrice, gasLimit: estimatedGas })
        return tx;
    }

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
            "https://node1.bundlr.network/account/balance/matic",
            {
                tx_id: txResp.hash,
            }
        );
        return res.status;
    };

    uploadItem = async (data: Buffer): Promise<any> => {
        const signer = new InjectedEthereumSigner(this.provider);
        await signer.setPublicKey();
        const item = createData(data, signer);
        await item.sign(signer);
        const res = await axios.post(`${this.bundlerAddress}/tx/matic`, item.getRaw(), {
            headers: { "Content-Type": "application/octet-stream", 'Access-Control-Allow-Origin': '*', },
            timeout: 100000,
            maxBodyLength: Infinity,
            validateStatus: (status) => (status > 200 && status < 300) || status !== 402
        })
        if (res.status === 402) {
            throw new Error("not enough funds to send data")
        }
        return res
    }
}
