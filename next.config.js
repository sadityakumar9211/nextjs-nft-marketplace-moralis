/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_ID: "Q6tgFIjemqU8fhlSXZwS79uqY5xpD82FyBuXmUgn",
    moralisApiKey: "X3CzY99zvof6MtQ",
    SERVER_URL: "https://tsqvp0nlvyjr.usemoralis.com:2053/server",
    moralisApiSecret: "vz5ClCQwt7DTU5v",
    masterKey: "8fukZ5HfWmGtsXJ8BivT5brFtLYDrSIVkBlFu1gu",
    chainId: "31337",
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
