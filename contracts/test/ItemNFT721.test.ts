import { ethers } from "hardhat";
import { expect } from "chai";

describe("ItemNFT721", function () {
  it("should mint and burn items of different types", async () => {
    const [owner, minter, burner, user] = await ethers.getSigners();
    const ItemNFT = await ethers.getContractFactory("ItemNFT721");
    const contract = await ItemNFT.deploy();

    await contract.setMinter(minter.address);
    await contract.setBurner(burner.address);

    // Mint type 1 (saber)
    await (contract.connect(minter) as any)["mintItem(address,uint8)"](user.address, 1);
    expect(await contract.balanceOf(user.address)).to.eq(1);
    const type = await (contract as any).itemTypeOf(1);
    expect(type).to.eq(1);

    // Burn as burner
    await contract.connect(burner).burnItem(1);
    expect(await contract.balanceOf(user.address)).to.eq(0);

    // Mint with invalid type
    await expect(
        (contract.connect(minter) as any)["mintItem(address,uint8)"](user.address, 0)
    ).to.be.revertedWith("Invalid item type");
  });
});
