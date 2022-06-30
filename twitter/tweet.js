require('dotenv').config();

const plaidConfig = require("../components/plaidConfig")
const twitterConfig = require("../components/twitterConfig")

async function getTransactionData(startDateString, endDateString) {

    let accountData = await plaidConfig.plaidClient.accountsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN
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
    // start date is sunday at beginning of the week
    let startDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1 <= 9 ? "0" + (new Date().getUTCMonth() + 1) : new Date().getUTCMonth() + 1}-${new Date().getUTCDate() - 6 <= 9 ? "0" + (new Date().getUTCDate() - 6) : new Date().getUTCDate() - 6}`
    // end date is day when cron job gets run - which is saturday at 11:55 pm
    let endDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1 <= 9 ? "0" + (new Date().getUTCMonth() + 1) : new Date().getUTCMonth() + 1}-${new Date().getUTCDate() <= 9 ? "0" + (new Date().getUTCDate()) : new Date().getUTCDate()}`

    let pastWeekTransactionData = await getTransactionData(startDate, endDate)

    // create the tweet thread and then loop through the transaction data and add it to the tweet thread

    // check if transaction data length is greater than zero, if so then tweet if not do not tweet

    if (pastWeekTransactionData.transactions.length > 0) {
        let tweetThread = [`Here are CommunityUtility's transactions from \n${startDate} to ${endDate}`]

        for (let i = 0; i < pastWeekTransactionData.transactions.length; i++) {
            tweetThread.push({
                text: `Payment Date: ${pastWeekTransactionData.transactions[i].date}\nPayment Categories: ${pastWeekTransactionData.transactions[i].category}\nPayment Name: ${pastWeekTransactionData.transactions[i].name}\nPayment Amount: ${pastWeekTransactionData.transactions[i].amount}`
            })
        }

        tweetThread.push('Help out someone in need here: https://communityutility.org/')

        try {
            twitterConfig.twitterClient.v2.tweetThread(tweetThread)
            console.log("WEEKLY TWEET FIRED SUCCESSFULLY")
        } catch (error) {
            console.log(error)
        }
    }
    else {
        console.log(`NO TRANSACTIONS FROM ${startDate} TO ${endDate}`)
    }
})()