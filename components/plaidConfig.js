const plaid = require('plaid');

const plaidConfig = new plaid.Configuration({
    basePath: plaid.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_DEV_SECRET,
        },
    },
});

const plaidClient = new plaid.PlaidApi(plaidConfig);

exports.plaidClient = plaidClient