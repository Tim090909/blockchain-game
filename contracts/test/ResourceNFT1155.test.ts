import { ethers } from "hardhat";
import { expect } from "chai";

describe("ResourceNFT1155", function () {
  it("should set minter and mint/burn resource", async () => {
    const [owner, minter, user] = await ethers.getSigners();
    const ResourceNFT = await ethers.getContractFactory("ResourceNFT1155");
    const contract = await ResourceNFT.deploy();
    await contract.setMinter(minter.address);

    // Minter can mint
    await contract.connect(minter).mintResource(user.address, 0, 10);
    expect(await contract.balanceOf(user.address, 0)).to.eq(10);

    // Minter can burn
    await contract.connect(minter).burnResource(user.address, 0, 5);
    expect(await contract.balanceOf(user.address, 0)).to.eq(5);

    // Non-minter cannot mint/burn
    await expect(
      contract.connect(user).mintResource(user.address, 0, 1)
    ).to.be.revertedWith("Only minter");
  });
});
