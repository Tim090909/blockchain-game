# 🛡️ Blockchain Game 'Козацький бізнес' - Craft & Trade Smart Contracts

This project implements a **smart contract-based crafting and trading system** on Ethereum (Sepolia testnet). Players can search for resources, craft NFT items, and trade them for ERC20 tokens via a decentralized marketplace.

---

## 📦 Deployed Contracts (Sepolia Testnet)

| Contract              | Address & Etherscan Link                                                                                                                                                  |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ResourceNFT1155       | [`0x47c7f53369Cda54407E9E127E2655D393C1EB2aE`](https://sepolia.etherscan.io/address/0x47c7f53369Cda54407E9E127E2655D393C1EB2aE)         |
| ItemNFT721            | [`0xDE647D4499c9Cf0B12f04AA7F8fcE0C5391F8994`](https://sepolia.etherscan.io/address/0xDE647D4499c9Cf0B12f04AA7F8fcE0C5391F8994)         |
| MagicToken            | [`0x022Cd2dc689195b93DbC34179f70a0ffa69616B7`](https://sepolia.etherscan.io/address/0x022Cd2dc689195b93DbC34179f70a0ffa69616B7)         |
| CraftingAndSearch     | [`0x4eF6c28Cc44D671d547d604705E092487c9E80f9`](https://sepolia.etherscan.io/address/0x4eF6c28Cc44D671d547d604705E092487c9E80f9)         |
| Marketplace           | [`0xBf98217626c6471dB4a16E1A44ee5696067a612a`](https://sepolia.etherscan.io/address/0xBf98217626c6471dB4a16E1A44ee5696067a612a)         |

> 📝 **Contract links** can be found on [Sepolia Etherscan](https://sepolia.etherscan.io/).  
> _Replace addresses above if you redeploy. Copy your deployed addresses after running the deploy script._


## 🚀 How to Deploy the Project

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/blockchain-rpg-game.git
cd blockchain-rpg-game
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Compile contracts
\`\`\`bash
npx hardhat compile
\`\`\`

### 4. Deploy to Sepolia
Set your Sepolia RPC and wallet private key in .env or hardhat.config.ts.
\`\`\`bash
npx hardhat run --network sepolia scripts/deploy.ts
\`\`\`

- Deployment script PRINTS ALL COMMANDS THAT YOU NEED TO RUN NEXT.

### 5. Replace the adresses in the frontend/data/constants.ts by new ones
\`\`\`typescript
export const RESOURCE_NFT_ADDRESS = "0x47c7f53369Cda54407E9E127E2655D393C1EB2aE";
export const ITEM_NFT_ADDRESS = "0xDE647D4499c9Cf0B12f04AA7F8fcE0C5391F8994";
export const MAGIC_TOKEN_ADDRESS = "0x022Cd2dc689195b93DbC34179f70a0ffa69616B7";
export const CRAFTING_CONTRACT_ADDRESS = "0x4eF6c28Cc44D671d547d604705E092487c9E80f9";
export const MARKETPLACE_ADDRESS = "0xBf98217626c6471dB4a16E1A44ee5696067a612a";
\`\`\`

---

## 🕹️ How to Play / Use the Contracts

1. **Search for Resources**
   - Call \`searchResources()\` in \`CraftingAndSearch\` to get random resources (wait 60s between uses).

2. **Craft Items**
   - Use functions in \`CraftingAndSearch\`:  
     - \`craftCossackSaber()\`  
     - \`craftEldersStaff()\`  
     - \`craftCharacternykArmor()\`  
     - \`craftBattleBracelet()\`  

3. **Trade/Sell Items**
   - Call \`sellItem(tokenId, price)\` in \`Marketplace\` contract.
   - Receive MagicTokens when your NFT is burned.

4. **Send NFTs**
   - Use \`safeTransferFrom()\` in \`ItemNFT721\` to send items to another wallet.


## 🧪 How to Run Tests (Coverage 100%)

\`\`\`bash
npx hardhat coverage
\`\`\`


## 📄 Contract Source Code

All contracts are in the \`/contracts\` folder.  
NatSpec documentation is provided in each Solidity file.


## 🧑‍💻 Repository

- [GitHub Repository](https://github.com/Tim090909/blockchain-game)

## 🏆 Project Status

- [x] All contracts deployed and verified on Sepolia  
- [x] Game actions (search, craft, trade) tested and working  
- [x] 100% test coverage  
- [x] NatSpec documentation in Solidity  
- [x] Frontend for interaction (optional)

---

## 📢 For the Reviewer

- Contracts deployed and available for testing at the addresses above (see Etherscan links).
- Instructions for deployment and usage included above.
- Source code and scripts in the repository, ready to run and test.


### ✍️ Author:  
**Tymofii Hrynchuk**  
2025
