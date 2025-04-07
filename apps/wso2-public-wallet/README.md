
# WSO2 Public Wallet Application




## Features

- Light/dark mode toggle
- Send WSO2 coins with accounts
- Check wallet balance
- View history of transactions


## Configuration Setup

Navigate to config.js.local file in public folder and then rename it to config.js. Then process with details provided below.


## Environment Variables

Edit environment variables in config.js as below

`"<https://example.com/signout>`  : Your signout url

`<https://example.com/signin>` :  Your signin url

`<your-client-id>` : Your asgardeo client id

`<https://api.example.com>` : Your asgardeo base url

`<https://rpc.example.com>` : Your rpc endpoint of ethereum nodes

`<0xYourContractAddress>` : Your contract id

`<12345>` : Your chain id

`<https://wallet.example.com/api>` : Base url of wallet service



## How to Start the Application

Once you configured configiration variables then open up a terminal and navigate to wso2-public-wallet directory. Then enter the following commands.

`npm install`
`npm start`

