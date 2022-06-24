require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const plaidConfig = require('../components/plaidConfig')

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
        products: ['auth', 'transactions'],
        language: 'en',
        country_codes: ['US']
    }

    try {
        const createTokenResponse = await plaidConfig.plaidClient.linkTokenCreate(toPlaidRequest);
        res.json(createTokenResponse.data)
    } catch (error) {
        console.log(error)
    }
})

// this is to exchange the public token from link for the access token
app.post('/api/exchange-public-token', express.urlencoded(), async (req, res) => {

    const publicToken = req.body.public_token

    try {
        const fromPlaidResponse = await plaidConfig.plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        })
        const accessToken = fromPlaidResponse.data.access_token

        // add a check to see if the name is already there, if so delete that line and write over it, if not just add it to the end

        fs.readFile(path.join(__dirname, "../.env"), 'utf8', function (err, data) {
            if (data.includes('PLAID_ACCESS_TOKEN = ')) {
                let replacementString = data.replace(/(?<=PLAID_ACCESS_TOKEN = ).+/i, `${accessToken}`)
                fs.writeFileSync(path.join(__dirname, "../.env"), replacementString, 'utf8')
            }
            else {
                fs.writeFileSync(path.join(__dirname, "../.env"), `\nPLAID_ACCESS_TOKEN = ${accessToken}`, { flag: "a+"})
            }
        });

    } catch (error) {
        console.log(error)
    }

})

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: ${PORT}`)
});