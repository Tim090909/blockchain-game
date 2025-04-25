import { ethers } from "hardhat";
import { expect } from "chai";

describe("Marketplace", function () {
  it("should allow selling an item for tokens", async () => {
    const [owner, minter, user] = await ethers.getSigners();
    const ItemNFT = await ethers.getContractFactory("ItemNFT721");
    const MagicToken = await ethers.getContractFactory("MagicToken");
    const Marketplace = await ethers.getContractFactory("Marketplace");

    const itemNFT = await ItemNFT.deploy();
    const magicToken = await MagicToken.deploy();

    await itemNFT.setMinter(owner.address);
    await itemNFT.setBurner(owner.address);
    await magicToken.setMinter(owner.address);

    const marketplace = await Marketplace.deploy(itemNFT.target, magicToken.target);
    await itemNFT.setBurner(marketplace.target);
    await magicToken.setMinter(marketplace.target);

    // Mint item for user
    await (itemNFT as any).mintItem(user.address, 2);

    // User must approve marketplace to transfer their NFT
    await itemNFT.connect(user).setApprovalForAll(marketplace.target, true);

    // Sell
    await marketplace.connect(user).sellItem(1, ethers.parseEther("5"));
    expect(await magicToken.balanceOf(user.address)).to.eq(ethers.parseEther("5"));
    expect(await itemNFT.balanceOf(user.address)).to.eq(0);
  });
});
