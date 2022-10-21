//this is the script which tells the moralis server to watch and index EVENTS

const Moralis = require("moralis/node")
require("dotenv").config()

const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337
//moralis understands chainId as: 1337
const moralisChainId = chainId=="31337"? "1337": chainId


//watching of EVENTS of which contract
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

const serverUrl = process.env.SERVER_URL
const appId = process.env.APP_ID 
const masterKey = process.env.masterKey

async function main() {
    await Moralis.start({serverUrl, appId, masterKey})
    console.log(`Working with contract address ${contractAddress}`)
    let itemListedOptions = {
        //Moralis understands chainId = 1337
        chainId:  moralisChainId,
        sync_historical: true, 
        address: contractAddress,
        topic: "ItemListed(address, address, uint256, uint256)",
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ItemListed",
            "type": "event"
        },
        tableName: "ItemListed",

    }
    

    let itemBoughtOptions = {
        chainId:  moralisChainId,
        sync_historical: true, 
        address: contractAddress,
        topic: "ItemBought(address, address, uint256, uint256)",
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ItemBought",
            "type": "event"
        },
        tableName: "ItemBought",

    }

    let itemCancelledOptions = {
        chainId:  moralisChainId,
        sync_historical: true, 
        address: contractAddress,
        topic: "ItemCancelled(address, address, uint256)",
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ItemCancelled",
            "type": "event"
        },
        tableName: "ItemCancelled", 
    }

    //sending them to our server
    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {useMasterKey: true})
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {useMasterKey: true})
    const cancelledResponse = await Moralis.Cloud.run("watchContractEvent", itemCancelledOptions, {useMasterKey: true})

    if(listedResponse.success && boughtResponse.success && cancelledResponse.success) {
        console.log("Success! Database Updated with watching events")
    }else{
        console.log("Something went wrong")
    }
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
