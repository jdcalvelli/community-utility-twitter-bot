require('dotenv').config();

const plaidConfig = require("../components/plaidConfig")

async function getAccountInfo() {
    let accountInfo = await plaidConfig.plaidClient.accountsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN
    })
    console.log(accountInfo.data)
}

getAccountInfo()