# Upgradeable ERC20 Token (Assignment 7)

An upgradeable ERC20 token using the **UUPS (Universal Upgradeable Proxy Standard)** pattern deployed on the Sepolia testnet. The contract starts as V1 and can be upgraded to V2 without losing token balances or state.

## Key Features

- **UUPS Upgradeable Pattern** – Gas-efficient proxy pattern with upgrade logic inside the implementation
- **Versioning** – `getVersion()` returns "V1" or "V2" depending on the current implementation
- **Minting** – Owner-only mint function to create new tokens
- **Burning (V2 only)** – New in V2: token burning functionality
- **Balance preservation** – All token balances remain unchanged after upgrade
- **OpenZeppelin Upgradeable** – Uses audited upgradeable contract libraries

## Project Structure

The project is organized as follows to clearly separate smart contracts, deployment scripts, and tests.

ERC20_Upgradeable/
hardhat.config.js         # Hardhat network configuration (Sepolia)
package.json              # NPM dependencies and scripts
.env                      # Environment variables - DO NOT COMMIT
README.md                 # This file

contracts/MyTokenV1.sol   # Initial implementation (V1)
contracts/MyTokenV2.sol   # Upgraded implementation (V2)

scripts/deploy-proxy.js   # Deploys V1 and the UUPS proxy
scripts/interact.js       # Mint tokens and transfer between accounts
scripts/upgrade.js        # Upgrades the proxy from V1 to V2

test/MyToken.js           # Unit tests (Mocha/Chai)

## Getting Started (Setup & Execution Guide)

Follow these steps in order to clone, configure, and run the Upgradeable ERC20 Token on the Sepolia testnet.

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Metamask with at least 2 accounts funded with Sepolia ETH
- Sepolia ETH faucet – get test funds from sepoliafaucet.com

### 1. Clone the Repository

Open your terminal and run:

*git clone <your-github-repo-url>*


*cd ERC20_Upgradeable*

### 2. Install Dependencies

Install all required Node.js packages:

*npm install*

This installs hardhat, @openzeppelin/hardhat-upgrades, @openzeppelin/contracts-upgradeable, dotenv, and other required packages.

### 3. Configure Environment Variables

Create a .env file in the project root and add the following content:

SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
SEPOLIA_PRIVATE_KEY_1=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
SEPOLIA_PRIVATE_KEY_2=0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde
PROXY_ADDRESS=

CRITICAL SECURITY NOTES:
- NEVER commit the .env file. Verify it's in your .gitignore.
- Replace the placeholder private keys with your actual Metamask private keys
- SEPOLIA_PRIVATE_KEY_1 is the deployer/owner account
- SEPOLIA_PRIVATE_KEY_2 is the second user account
- PROXY_ADDRESS will be filled automatically after deployment
- To get private keys from Metamask: Account Details > Export Private Key
- Keep these keys secure – they control real assets on testnet/mainnet

### 4. Verify Hardhat Configuration

Open *hardhat.config.js* in your code editor and verify it contains the following configuration:

require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY_1,
        process.env.SEPOLIA_PRIVATE_KEY_2
      ].filter(Boolean),
    },
  },
};

No command needs to be run for this step – simply ensure the file matches the above.

### 5. Clean and Compile

*npx hardhat clean*


*npx hardhat compile*

Expected output: Compiled 20 Solidity files successfully

### 6. Deploy the Proxy

Deploy the V1 implementation and the UUPS proxy:

*npx hardhat run scripts/deploy-proxy.js --network sepolia*

Expected output:

Deploying with account: 0x1111111111111111111111111111111111111111
Deploying MyTokenV1...
Proxy deployed to: 0x4444444444444444444444444444444444444444
Implementation deployed to: 0x5555555555555555555555555555555555555555
Current version: V1
Deployer balance: 1000000.0 MTK

IMPORTANT: Copy the proxy address shown after "Proxy deployed to:" and add it to your .env file:

PROXY_ADDRESS=0x4444444444444444444444444444444444444444

Then save the .env file.

### 7. Update Scripts to Read Proxy Address from .env

Open *scripts/interact.js* and *scripts/upgrade.js*. At the top of each file, add code to read PROXY_ADDRESS from environment variables.

For *scripts/interact.js*, the beginning should look like this:

const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer, user] = await hre.ethers.getSigners();
  const proxyAddress = process.env.PROXY_ADDRESS;

  if (!proxyAddress) {
    console.error("PROXY_ADDRESS not set in .env");
    process.exit(1);
  }
  ...

For *scripts/upgrade.js*, add the same lines at the top.

Then remove any hardcoded *const proxyAddress = "..."* lines from both files.

### 8. Interact with the Token (Mint + Transfer)

Run the interaction script to mint tokens to the second user and transfer some back:

*npx hardhat run scripts/interact.js --network sepolia*

Expected output:

Deployer address: 0x1111111111111111111111111111111111111111
User address: 0x2222222222222222222222222222222222222222

Initial balances:
  Deployer: 1000000.0 MTK
  User: 0.0 MTK

Minting 1000 MTK to user...

Balances after mint:
  Deployer: 1000000.0 MTK
  User: 1000.0 MTK

Transferring 500 MTK from user to deployer...

Final balances:
  Deployer: 1000500.0 MTK
  User: 500.0 MTK

### 9. Upgrade to V2

Upgrade the proxy to point to the V2 implementation:

*npx hardhat run scripts/upgrade.js --network sepolia*

Expected output:

Upgrading with account: 0x1111111111111111111111111111111111111111
Deploying MyTokenV2...
Proxy upgraded to V2
New version: V2
Deployer balance after upgrade: 1000500.0 MTK

### 10. Verify the Upgrade

Check the version and balances through the Hardhat console:

*npx hardhat console --network sepolia*

Then run:

*const proxyAddress = process.env.PROXY_ADDRESS;  // Or paste the address directly*


*const MyTokenV2 = await ethers.getContractFactory("MyTokenV2");*


*const token = await MyTokenV2.attach(proxyAddress);*


*const version = await token.getVersion();*


*console.log("Version:", version);*


*const deployerBalance = await token.balanceOf("0x1111111111111111111111111111111111111111");*


*console.log("Deployer balance:", ethers.formatEther(deployerBalance));*


*const userBalance = await token.balanceOf("0x2222222222222222222222222222222222222222");*


*console.log("User balance:", ethers.formatEther(userBalance));*


*const totalSupply = await token.totalSupply();*


*console.log("Total supply:", ethers.formatEther(totalSupply));*

Expected output:

Version: V2
Deployer balance: 1000500.0
User balance: 500.0
Total supply: 1001000.0

## Diagnostics

If any step fails, check the following:

### Check if PROXY_ADDRESS is set in .env:
*cat .env | grep PROXY_ADDRESS*

### Check if proxy address is correct in scripts:
- Verify that scripts read from *process.env.PROXY_ADDRESS*
- The address should match what was shown during deployment

### Check owner of the contract:

*const owner = await token.owner();*


*console.log("Owner:", owner);*

Only the owner can call mint() and upgrade() functions.

### Check implementation address:

*const implementation = await upgrades.erc1967.getImplementationAddress(proxyAddress);*


*console.log("Current implementation:", implementation);*

### Check if upgrade was successful:
*const version = await token.getVersion();*


*console.log("Version:", version);  // Should return "V2"*

## Script Reference Table

| Action                   | Command                                                     |
|--------------------------|-------------------------------------------------------------|
| Clean                    | *npx hardhat clean*                                         |
| Compile                  | *npx hardhat compile*                                       |
| Deploy proxy             | *npx hardhat run scripts/deploy-proxy.js --network sepolia* |
| Interact (mint/transfer) | *npx hardhat run scripts/interact.js --network sepolia*     |
| Upgrade to V2            | *npx hardhat run scripts/upgrade.js --network sepolia*      |
| Open console             | *npx hardhat console --network sepolia*                     |
| Run tests                | *npx hardhat test*                                          |

## Successful Deployment Links (Example)

These are placeholder links. Replace with your actual deployment links.

| Resource             | Link                                                               |
|----------------------|--------------------------------------------------------------------|
| Proxy Contract       | 0x4444444444444444444444444444444444444444                         |
| Implementation V1    | 0x5555555555555555555555555555555555555555                         |
| Implementation V2    | 0x6666666666666666666666666666666666666666                         |
| Mint Transaction     | 0x7b8c3f2e1d4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c                         |
| Transfer Transaction | 0x3e8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9                        |
| Upgrade Transaction  | 0xa809322d8f4c06b34a69b302cd10a82cce99dfd80cc7cdbc0cb01e7e9c70a0f4 |

## Transaction Sequence Explained

You should see exactly 3 transactions on Etherscan (in chronological order):

| # | Method              | What it does                             |
|---|---------------------|------------------------------------------|
| 3 | Mint                | Creates 1000 MTK for the user            |
| 2 | Transfer            | Sends 500 MTK from user back to deployer |
| 1 | Upgrade To And Call | Upgrades proxy to V2                     |

These transactions represent the complete workflow: mint → transfer → upgrade.

## Technologies Used

- Solidity ^0.8.28 – Smart contract development
- Hardhat – Development environment and testing
- Ethers.js – Ethereum interaction library
- OpenZeppelin Upgradeable – UUPS proxy pattern
- OpenZeppelin Hardhat Upgrades – Plugin for seamless upgrades
- Sepolia Testnet – Ethereum test network
- Mocha/Chai – Unit testing framework

## Notes

- The UUPS pattern puts upgrade logic inside the implementation contract
- `_authorizeUpgrade` is overridden to restrict upgrades to the owner only
- V2 adds a `burn()` function and overrides `getVersion()` to return "V2"
- All token balances are preserved during upgrade because storage layout is consistent
- The proxy address never changes – only the implementation it points to
- Storing PROXY_ADDRESS in .env means you only need to update it in one place

## Common Issues and Solutions

| Issue                            | Solution                                                                   |
|----------------------------------|----------------------------------------------------------------------------|
| "UUPSUnauthorizedCall"           | Ensure upgrade is called by the owner                                      |
| Mint doesn't work                | Check that you are using the proxy address, not the implementation address |
| Version still shows "V1"         | Upgrade transaction may have failed – check Etherscan and retry            |
| Balance doesn't include transfer | The transfer script may not have executed – run interact.js again          |
| "Contract not verified"          | Implementation contract needs separate verification on Etherscan           |
| "PROXY_ADDRESS not set"          | Add PROXY_ADDRESS to .env file after deployment                            |

## Assignment Completion Checklist

| Requirement                      | Status |
|----------------------------------|--------|
| V1 contract deployed             | YES    |
| Proxy contract deployed          | YES    |
| PROXY_ADDRESS in .env            | YES    |
| Scripts read from .env           | YES    |
| Mint function works              | YES    |
| Transfer function works          | YES    |
| Upgrade to V2 executed           | YES    |
| getVersion() returns "V2"        | YES    |
| Balances preserved after upgrade | YES    |
| All transactions on Etherscan    | YES    |
| Unit tests pass                  | YES    |

---

Assignment 7 - Complete