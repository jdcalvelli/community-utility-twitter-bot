require('dotenv').config();

const twitterapiv2 = require("twitter-api-v2")

// using my twitter account as a holdover
const twitterClient = new twitterapiv2.TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
})

exports.twitterClient = twitterClient