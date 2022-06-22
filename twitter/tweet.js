require('dotenv').config();

const plaidConfig = require("../components/plaidConfig")

async function getAccountInfo() {
    let accountInfo = await plaidConfig.plaidClient.accountsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN
    })
    console.log(accountInfo.data)
}

async function getTransactionData() {
    let transactionData = await plaidConfig.plaidClient.transactionsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN,
        start_date: '2022-01-01',
        end_date: '2022-06-21',
    })
    console.log(transactionData.data)
}

//getAccountInfo()
getTransactionData()