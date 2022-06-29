require('dotenv').config();

const plaidConfig = require("../components/plaidConfig")
const twitterConfig = require("../components/twitterConfig")

async function getTransactionData(startDateString, endDateString) {

    let accountData = await plaidConfig.plaidClient.accountsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN
    })
    
    plaidConfig.plaidClient.transactionsRefresh({
        access_token: process.env.PLAID_ACCESS_TOKEN,
    })

    let transactionData = await plaidConfig.plaidClient.transactionsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN,
        start_date: startDateString,
        end_date: endDateString,
        options: {
            account_ids: [accountData.data.accounts[0].account_id]
        }
    })

    return transactionData.data
}

(async function createTweetThread() {
    // start date is 2 days before current day
    let startDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1 <= 9 ? "0" + (new Date().getUTCMonth() + 1) : new Date().getUTCMonth() + 1}-${new Date().getUTCDate() - 2 <= 9 ? "0" + (new Date().getUTCDate() - 2) : new Date().getUTCDate() - 2}`
    // end date is 1 day before current day to capture transactions
    let endDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1 <= 9 ? "0" + (new Date().getUTCMonth() + 1) : new Date().getUTCMonth() + 1}-${new Date().getUTCDate() - 1 <= 9 ? "0" + (new Date().getUTCDate() - 1) : new Date().getUTCDate() - 1}`

    let pastDayTransactionData = await getTransactionData(startDate, endDate)

    // create the tweet thread and then loop through the transaction data and add it to the tweet thread

    // check if transaction data length is greater than zero, if so then tweet if not do not tweet

    if (pastDayTransactionData.transactions.length > 0) {
        let tweetThread = [`Here are CommunityUtility's transactions from ${startDate} to ${endDate}`]

        for (let i = 0; i < pastDayTransactionData.transactions.length; i++) {
            tweetThread.push({
                text: `Authorized Date: ${pastDayTransactionData.transactions[i].authorized_date}\nPayment Method: ${pastDayTransactionData.transactions[i].payment_meta.payment_method}\nMerchant Name: ${pastDayTransactionData.transactions[i].merchant_name}\nPayment Amount: ${pastDayTransactionData.transactions[i].amount}`
            })
        }

        tweetThread.push('Help out someone in need here: https://communityutility.org/')

        try {
            twitterConfig.twitterClient.v2.tweetThread(tweetThread)
            console.log("DAILY TWEET FIRED SUCCESSFULLY")
        } catch (error) {
            console.log(error)
        }
    }
    else {
        console.log(`NO TRANSACTIONS DURING ${startDate}`)
    }
})()