require('dotenv').config();

const plaidConfig = require("../components/plaidConfig")

const twitterapiv2 = require("twitter-api-v2")

// const twitterClient = new twitterapiv2.TwitterApi({
//     appKey: process.env.TWITTER_APP_KEY,
//     appSecret: process.env.TWITTER_APP_SECRET,
//     accessToken: process.env.TWITTER_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_ACCESS_SECRET,
// })

async function getTransactionData(startDateString, endDateString) {
    let transactionData = await plaidConfig.plaidClient.transactionsGet({
        access_token: process.env.PLAID_ACCESS_TOKEN,
        start_date: startDateString,
        end_date: endDateString,
    })

    return transactionData.data
}

async function createTweetThread() {
    let startDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1 <= 9 ? "0" + (new Date().getUTCMonth() + 1): new Date().getUTCMonth() + 1}-${new Date().getUTCDate() - 2 <=9 ? "0" + (new Date().getUTCDate() - 2) : new Date().getUTCDate() - 2}`
    let endDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1 <= 9 ? "0" + (new Date().getUTCMonth() + 1): new Date().getUTCMonth() + 1}-${new Date().getUTCDate() - 2 <=9 ? "0" + (new Date().getUTCDate() - 2) : new Date().getUTCDate() - 2}`

    console.log(startDate)
    console.log(endDate)

    let pastDayTransactionData = await getTransactionData("2022-01-01", "2022-01-02")

    console.log(pastDayTransactionData)

    // create the tweet thread and then loop through the transaction data and add it to the tweet thread

}

createTweetThread()

// start date is 2 days before current day
// end date is 1 day before current day to capture transactions
// do we have to make a database to have them and then check that the transactions arent tweeted twice? probably
// loop over total transactions