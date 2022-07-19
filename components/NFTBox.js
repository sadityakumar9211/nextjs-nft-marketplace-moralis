import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/nftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    createdAt,
    seller,
}) {
    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
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
            console.log(imageURI)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <div>
                {imageURI ? (
                    <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
