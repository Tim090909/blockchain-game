import { ethers } from "hardhat";
import { expect } from "chai";

describe("MagicToken", function () {
  it("should allow minter to mint tokens", async () => {
    const [owner, minter, user] = await ethers.getSigners();
    const MagicToken = await ethers.getContractFactory("MagicToken");
    const contract = await MagicToken.deploy();

    await contract.setMinter(minter.address);

    await contract.connect(minter).mint(user.address, ethers.parseEther("10"));
    expect(await contract.balanceOf(user.address)).to.eq(ethers.parseEther("10"));

    await expect(
      contract.connect(user).mint(user.address, 1)
    ).to.be.revertedWith("Only minter");
  });
});
