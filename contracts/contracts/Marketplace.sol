// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ItemNFT721.sol";
import "./MagicToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Marketplace - Trade crafted items for tokens
/// @author Hrynchuk T.
/// @notice Allows players to sell items for MagicToken
contract Marketplace is Ownable {
    ItemNFT721 public itemNFT;
    MagicToken public magicToken;

    /// @notice Emitted when item is sold
    /// @param seller Seller address
    /// @param itemId ID of sold item
    /// @param price Price in MagicToken
    event ItemSold(address indexed seller, uint256 indexed itemId, uint256 price);

    /// @notice Deploy Marketplace
    /// @param _itemNFT Address of the item NFT contract
    /// @param _magicToken Address of MagicToken
    constructor(address _itemNFT, address _magicToken) Ownable(msg.sender) {
        itemNFT = ItemNFT721(_itemNFT);
        magicToken = MagicToken(_magicToken);
    }

    /// @notice Sell an item for tokens (burns item, mints tokens)
    /// @param itemId Item to sell
    /// @param price Price in MagicToken to receive
    function sellItem(uint256 itemId, uint256 price) external {
        require(itemNFT.ownerOf(itemId) == msg.sender, "You don't own this item");
        itemNFT.transferFrom(msg.sender, address(this), itemId);
        itemNFT.burnItem(itemId);
        magicToken.mint(msg.sender, price);
        emit ItemSold(msg.sender, itemId, price);
    }
}
