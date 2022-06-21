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
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: ${PORT}`)
});