import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="Welcome to the NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Sell page
        <Link href="/">Back to Index</Link>
    </div>
  )
}
