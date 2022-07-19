//updates the active items on the marketplace in the server.

//Create a new table called `ActiveItems`
// Add items when they are listed on the marketplace
// Remove items when they are bought or cancelled

Moralis.Cloud.afterSave("ItemListed", async function (request) {
    //Every event gets triggered twice, once on unconfirmed, again on confirmed.
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed Tx")
    if (confirmed) {
        logger.info("Found Item!")
        //if (creating if not exists) and grabbing ActiveItem table
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        //setting columns
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get(
                "address"
            )}. TokenId: ${request.object.get("tokenId")}`
        )
        logger.info("Saving...")
        await activeItem.save()    //saving the item
    }
})
