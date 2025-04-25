import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // 1. Deploy ResourceNFT1155
  const ResourceNFT = await ethers.getContractFactory("ResourceNFT1155");
  const resourceNFT = await ResourceNFT.deploy();
  await resourceNFT.waitForDeployment?.();
  console.log("ResourceNFT1155:", resourceNFT.target);

  // 2. Deploy ItemNFT721
  const ItemNFT = await ethers.getContractFactory("ItemNFT721");
  const itemNFT = await ItemNFT.deploy();
  await itemNFT.waitForDeployment?.();
  console.log("ItemNFT721:", itemNFT.target);

  // 3. Deploy MagicToken
  const MagicToken = await ethers.getContractFactory("MagicToken");
  const magicToken = await MagicToken.deploy();
  await magicToken.waitForDeployment?.();
  console.log("MagicToken:", magicToken.target);

  // 4. Deploy CraftingAndSearch
  const CraftingAndSearch = await ethers.getContractFactory("CraftingAndSearch");
  const craftingAndSearch = await CraftingAndSearch.deploy(resourceNFT.target, itemNFT.target);
  await craftingAndSearch.waitForDeployment?.();
  console.log("CraftingAndSearch:", craftingAndSearch.target);

  // 5. Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(itemNFT.target, magicToken.target);
  await marketplace.waitForDeployment?.();
  console.log("Marketplace:", marketplace.target);

  // --- Print summary block
  console.log(`
================== Deployed Contract Addresses ==================
ResourceNFT1155      : ${resourceNFT.target}
ItemNFT721           : ${itemNFT.target}
MagicToken           : ${magicToken.target}
CraftingAndSearch    : ${craftingAndSearch.target}
Marketplace          : ${marketplace.target}
==============================================================
  `);

  // 6. Set roles (minter/burner)
  await resourceNFT.setMinter(craftingAndSearch.target);
  console.log("✅ ResourceNFT1155 minter set to CraftingAndSearch");

  await itemNFT.setMinter(craftingAndSearch.target);
  await itemNFT.setBurner(marketplace.target);
  console.log("✅ ItemNFT721 minter set to CraftingAndSearch and burner set to Marketplace");

  await magicToken.setMinter(marketplace.target);
  console.log("✅ MagicToken minter set to Marketplace");

  console.log("\n🎉 All contracts deployed and roles set up!\n");

  // Print out hardhat verify commands for each contract
  console.log("Run these commands to verify your contracts on Etherscan:\n");
  console.log(`npx hardhat verify --network sepolia ${resourceNFT.target}`);
  console.log(`npx hardhat verify --network sepolia ${itemNFT.target}`);
  console.log(`npx hardhat verify --network sepolia ${magicToken.target}`);
  console.log(`npx hardhat verify --network sepolia ${craftingAndSearch.target} ${resourceNFT.target} ${itemNFT.target}`);
  console.log(`npx hardhat verify --network sepolia ${marketplace.target} ${itemNFT.target} ${magicToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 

/**
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy ResourceNFT1155
  const ResourceNFT = await ethers.getContractFactory("ResourceNFT1155");
  const resourceNFT = await ResourceNFT.deploy();
  console.log("ResourceNFT1155:", resourceNFT.target);

  // 2. Deploy ItemNFT721
  const ItemNFT = await ethers.getContractFactory("ItemNFT721");
  const itemNFT = await ItemNFT.deploy();
  console.log("ItemNFT721:", itemNFT.target);

  // 3. Deploy MagicToken
  const MagicToken = await ethers.getContractFactory("MagicToken");
  const magicToken = await MagicToken.deploy();
  console.log("MagicToken:", magicToken.target);

  // 4. Deploy CraftingAndSearch
  const CraftingAndSearch = await ethers.getContractFactory("CraftingAndSearch");
  const craftingAndSearch = await CraftingAndSearch.deploy(resourceNFT.target, itemNFT.target);
  console.log("CraftingAndSearch:", craftingAndSearch.target);

  // 5. Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(itemNFT.target, magicToken.target);
  console.log("Marketplace:", marketplace.target);

  // 6. Set roles (minter/burner)
  // ResourceNFT1155: CraftingAndSearch is minter
  await resourceNFT.setMinter(craftingAndSearch.target);
  console.log("ResourceNFT1155 minter set to CraftingAndSearch");

  // ItemNFT721: CraftingAndSearch is minter, Marketplace is burner
  await itemNFT.setMinter(craftingAndSearch.target);
  await itemNFT.setBurner(marketplace.target);
  console.log("ItemNFT721 minter set to CraftingAndSearch and burner set to Marketplace");

  // MagicToken: Marketplace is minter
  await magicToken.setMinter(marketplace.target);
  console.log("MagicToken minter set to Marketplace");

  console.log("All contracts deployed and roles set up!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

 */