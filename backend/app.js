require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


const plaid = require('plaid');

const plaidConfig = new plaid.Configuration({
    basePath: plaid.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new plaid.PlaidApi(plaidConfig);

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// this is the homepage
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// this is to create a link token
app.post('/api/create-link-token', async (req, res) => {
    const toPlaidRequest = {
        user: {
            client_user_id: 'test123',
        },
        client_name: "Mutual Aid Test",
        products: ['auth'],
        language: 'en',
        country_codes: ['US']
    }

    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(toPlaidRequest);
        res.json(createTokenResponse.data)
    } catch (error) {
        console.log(error)
    }
})

// this is to exchange the public token from link for the access token
app.post('/api/exchange-public-token', express.urlencoded(), async (req, res)=> {
    
    console.log("-------")
    console.log(req.body)
    console.log("-------")
    

    const publicToken = req.body.public_token
    console.log("-------")
    console.log(publicToken)
    console.log("-------")

    try {
        const fromPlaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        })
        const accessToken = fromPlaidResponse.data.access_token

        console.log("-------")
        console.log(accessToken)
        console.log("-------")

        fs.writeFileSync(path.join(__dirname, "../.env"), `\nPLAID_ACCESS_TOKEN = ${accessToken}`, { flag: "a+"})

    } catch (error) {
        console.log(error)
    }

})

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: ${PORT}`)
});