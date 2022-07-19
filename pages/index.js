import Image from "next/image"
import styles from "../styles/Home.module.css"

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

    
    return <div className={styles.container}>Hi</div>
}
