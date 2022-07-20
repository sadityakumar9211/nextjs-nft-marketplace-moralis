import styles from "../styles/Home.module.css"
import { Form } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"

export default function Home() {
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()
    const { chainId: chainIdHex } = useMoralis
    const chainId = chainIdHex ? parseInt(chainIdHex).toString() : "31337"

    const marketplaceAddress = networkMapping[chainId].NftMarketplace[0]
    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils
            .parseUnits(data.data[2].inputResult, "ether")
            .toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => {
                handleApproveSuccess(nftAddress, tokenId, price)
            },
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Okay now time to list...")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: listOptions,
            onSuccess: () => {
                handleListSuccess
            },
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleListSuccess = async function () {
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell Your NFT"
                id="Main Form"
            />
        </div>
    )
}
