// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ItemNFT721 - ERC721 Game Items
/// @author Hrynchuk T.
/// @notice ERC721 for unique crafted items
contract ItemNFT721 is ERC721Enumerable, Ownable {
    uint256 public nextItemId = 1;
    address public minter;
    address public burner;

    /// @notice Stores the type for each token: 1=saber, 2=staff, 3=armor, 4=bracelet
    mapping(uint256 => uint8) public itemTypeOf;

    /// @notice Constructor for ItemNFT721
    constructor() ERC721("GameItem", "GI") Ownable(msg.sender) {}

    /// @notice Set minter (allowed to mint items)
    /// @param _minter Address allowed to mint items
    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    /// @notice Set burner (allowed to burn items)
    /// @param _burner Address allowed to burn items
    function setBurner(address _burner) external onlyOwner {
        burner = _burner;
    }

    /// @notice Mint a new item to address `to`
    /// @param to Recipient address
    /// @param itemType Type of item (1=saber, 2=staff, 3=armor, 4=bracelet)
    /// @return itemId ID of the minted item
    function mintItem(address to, uint8 itemType) external returns (uint256) {
        require(msg.sender == minter, "Only minter");
        require(itemType >= 1 && itemType <= 4, "Invalid item type");
        uint256 itemId = nextItemId++;
        _mint(to, itemId);
        itemTypeOf[itemId] = itemType;
        return itemId;
    }

    /// @notice Burn an item
    /// @param itemId ID of the item to burn
    function burnItem(uint256 itemId) external {
        require(msg.sender == burner, "Only burner");
        _burn(itemId);
        delete itemTypeOf[itemId];
    }
}
