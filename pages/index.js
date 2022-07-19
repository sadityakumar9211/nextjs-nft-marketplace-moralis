import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"

export default function Home() {
    //How do we show the recently listed NFTs?

    // we will index the events off-chain and then read from our database.
    // Setup a server to listen for those events to be fired, and we will add them to a database to query.
    // Isn't that centralized? No necessarily --> GraphQL is the answer.

    //The Graph does it in a decentralized way.
    //Moralis does it in a centralized way and comes with a ton of the features.

    // All our logic is still 100% on chain.
    // speed & development time
    // Its really hard to start a pro blockchain project 100% decentralized.
    // They are working open sourcing their code.
    // Feature Richness

    //How do we show the recently listed NFTs?
    // -by querying the moralis database and using the ActiveItem table
    const { isWeb3Enabled } = useMoralis()
    const { data: listedNfts, isFetching: fetchingListedNfts } =
        useMoralisQuery(
            //table name
            //function for the query
            "ActiveItem",
            (query) => {
                return query.limit(10).descending("tokenId")
            } //10 latest tokens
        )

    if (listedNfts.length != 0) {
        console.log(listedNfts)
    } else {
        console.log("listed NFT is empty")
    }

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-3 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => {
                            console.log(nft.attributes)
                            const {
                                price,
                                nftAddress,
                                tokenId,
                                marketplaceAddress,
                                seller,
                                createdAt,
                            } = nft.attributes
                            return (
                                <div>
                                    <NFTBox
                                        key={`${nftAddress}-${tokenId}`}
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
