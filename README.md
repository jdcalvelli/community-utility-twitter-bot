# community-utility-twitter-bot

A NodeJS project for Community Utility, a Chicago based Mutual Aid organization, to make their payment transactions public and accountable. The project utilizes the Plaid API in order to derive payment details for a particular account during the past week, and then pipes that information into the Twitter-Api-V2 API in order to make those transactions publicly visible on Community Utility's Twitter account.

See it in action [here](https://mobile.twitter.com/comm_utility)! 

Tools Used
- NodeJS
- Twitter-Api-V2
- Plaid
- ExpressJS
- DotEnv

### Potential for Use Case Replication

While the project as it exists isn't necessarily written to be plug and play, I believe it could relatively easily be refactored for usage by other institutions that would like their transactions to be made publically available via a Twitter account. Below I'll outline some of the steps that another institution would have to take in order to begin adapting this codebase for their purposes!

If anyone would like to make the codebase even more plug and play, feel free to fork or even open a pull request!

##### Step Zero: Pull this repository to a server with constant uptime and install dependencies :D

##### Step One: Prepare your Plaid and Twitter accounts

Make sure to create a Plaid account [here](https://plaid.com/) for your institution and to upgrade your existing institutional Twitter account, or create a new one for the purpose of this bot and upgrade it, to a developer account [here](https://developer.twitter.com/). Notate your Plaid Development Environment API Keys, and your Twitter API Key and Secret and Access Token and Secret. 

You'll need to add them to the .env file in your copy of the project repository.

##### Step Two: Get your Plaid Access Token

The Plaid API works by passing a variety of tokens between their servers and a client application. The whole process is captured within the Frontend and Backend folders in the project repository. In order to get access to the final Access Token needed by the tweeting script, navigate to the repository folder and run the following command:

```

node backend/app.js

```

This will make available the Frontend at your server's IP Address, with a specified port inside of the local .env file. Access that site and fill in the Plaid Link pop up with your institution's banking information. Once the Plaid Link pop up has completed its process, feel free to close the site and the server. The necessary Plaid Access Token will be saved into the local .env file.

This process need only be repeated in the event of a change in the institution's bank account password. Otherwise, it is not necessary to undergo this step again.

##### Step Three: Create a cronjob to run the twitter script every week.

A working shell script for this purpose is included in the project repository. The script could also be used as a template if so desired.

##### Step Four: Watch the script work every week for a while to ensure that your transactions are being represented!

Feel free to reach out to me on Twitter (linked in my profile) with any questions about the script or for help with implementation for additional institutions. Thanks!!!
