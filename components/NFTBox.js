import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/nftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

const truncatStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr
    const separator = "..."
    const separatorLength = separator.length
    const charToShow = strLen - separatorLength
    const frontChars = Math.ceil(charToShow / 2)
    const backChars = Math.floor(charToShow / 2)

    return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
    )
}

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)

    const hideModal = () => {
        setShowModal(false)
    }

    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    //it is called whenever, an event is fired or transaction is done at the frontend.
    async function updateUI() {
        //this is a helping function
        //we have to get the token URI because it is dynamic and changes based on the priceFeed.
        //If it was static then we would have also just indexed it into the moralis database just like price of the token.
        //But since it is dynamic I have to make request to the blockchain to get the tokenURI and hence imageURI to display the image.

        //get the tokenURI
        //using the image tag from the tokenURI, get the image

        const tokenURI = await getTokenURI()
        console.log(`The tokne URI is ${tokenURI}`)

        if (tokenURI) {
            //IPFS Gateway: A server will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            const tokenURIResponse = await (await fetch(requestURL)).json() //getting and converting
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser
        ? "you"
        : truncatStr(seller || "", 15)

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => {
                      console.log(error)
                  },
                  onSuccess: () => handleBuyItemSuccess(),
              })
    }

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item purchased successfully",
            title:"Item Bought",
            position: "topR",
        })
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div className="p-4">
                        <div>
                            <UpdateListingModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                marketplaceAddress={marketplaceAddress}
                                nftAddress={nftAddress}
                                seller={seller}
                                price={price}
                                onClose={hideModal}
                            />
                            <Card
                                title={tokenName}
                                description={tokenDescription}
                                onClick={handleCardClick}
                            >
                                <div className="p-2">
                                    <div className="flex flex-col items-end gap-2">
                                        <div>#{tokenId}</div>
                                        <div className="italic text-sm">
                                            Owned by{" "}
                                            <span className="bg-slate-600 p-1 rounded text-gray-50">
                                                {formattedSellerAddress}
                                            </span>
                                        </div>
                                        <div className="self-center">
                                            <Image
                                                loader={() => imageURI}
                                                src={imageURI}
                                                height="200"
                                                width="200"
                                            />
                                        </div>
                                        <div className="self-center">
                                            <span className="p-1 px-2 font-bold bg-slate-500 rounded-xl text-gray-50">
                                                {ethers.utils.formatUnits(
                                                    price,
                                                    "ether"
                                                )}
                                                ETH
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
