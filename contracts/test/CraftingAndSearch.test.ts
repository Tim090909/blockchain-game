import { ethers } from "hardhat";
import { expect } from "chai";

describe("CraftingAndSearch", function () {
  let owner: any, user: any;
  let resourceNFT: any, itemNFT: any, crafting: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const ResourceNFT = await ethers.getContractFactory("ResourceNFT1155");
    const ItemNFT = await ethers.getContractFactory("ItemNFT721");
    const Crafting = await ethers.getContractFactory("CraftingAndSearch");

    resourceNFT = await ResourceNFT.deploy();
    itemNFT = await ItemNFT.deploy();
    crafting = await Crafting.deploy(resourceNFT.target, itemNFT.target);
  });
  
  
  it("should revert if user tries to craft without enough resources", async () => {
    await resourceNFT.setMinter(crafting.target);
    await itemNFT.setMinter(crafting.target);
    // Not enough resources for anything
    await expect(crafting.connect(user).craftCossackSaber()).to.be.reverted;
  });
  
  it("should search resources and revert if called too soon", async () => {
    await resourceNFT.setMinter(crafting.target);
    await itemNFT.setMinter(crafting.target);
  
    // First search works
    await crafting.connect(user).searchResources();
    // Second search immediately after reverts
    await expect(
      crafting.connect(user).searchResources()
    ).to.be.revertedWith("Wait 60s");
  });
  
});

