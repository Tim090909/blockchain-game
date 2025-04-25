// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CraftingAndSearch - Resource search & item crafting
/// @author Hrynchuk T.
/// @notice Main logic for searching resources and crafting items in the game.
/// @dev Only this contract can mint/burn resources & items

import "./ResourceNFT1155.sol";
import "./ItemNFT721.sol";

contract CraftingAndSearch {
    ResourceNFT1155 public resourceNFT;
    ItemNFT721 public itemNFT;
    mapping(address => uint256) public lastSearch;

    /// @notice Emitted when a player searches for resources.
    /// @param user The address of the player.
    /// @param resources Array of resource types found (length 3).
    event Searched(address indexed user, uint256[3] resources);

    /// @notice Deploys with references to ResourceNFT1155 and ItemNFT721.
    /// @param _resourceNFT Address of the ERC1155 resource contract.
    /// @param _itemNFT Address of the ERC721 item contract.
    constructor(address _resourceNFT, address _itemNFT) {
        resourceNFT = ResourceNFT1155(_resourceNFT);
        itemNFT = ItemNFT721(_itemNFT);
    }

    /// @notice Player searches for 3 random resources (once per 60s)
    function searchResources() external {
        require(block.timestamp >= lastSearch[msg.sender] + 60, "Wait 60s");
        lastSearch[msg.sender] = block.timestamp;
        uint256[3] memory found;
        for (uint256 i = 0; i < 3; i++) {
            uint256 resType = uint256(
                keccak256(abi.encodePacked(msg.sender, block.timestamp, i))
            ) % resourceNFT.NUM_RESOURCES();
            found[i] = resType;
            resourceNFT.mintResource(msg.sender, ResourceNFT1155.Resource(resType), 1);
        }
        emit Searched(msg.sender, found);
    }

    /// @notice Craft Cossack Saber: 3 Iron, 1 Wood, 1 Leather
    function craftCossackSaber() external {
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Iron, 3);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Wood, 1);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Leather, 1);
        itemNFT.mintItem(msg.sender, 1);
    }

    /// @notice Craft Elder's Staff: 2 Wood, 1 Gold, 1 Diamond
    function craftEldersStaff() external {
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Wood, 2);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Gold, 1);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Diamond, 1);
        itemNFT.mintItem(msg.sender, 2);
    }

    /// @notice Craft Characternyk Armor (optional): 4 Leather, 2 Iron, 1 Gold
    function craftCharacternykArmor() external {
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Leather, 4);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Iron, 2);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Gold, 1);
        itemNFT.mintItem(msg.sender, 3);
    }

    /// @notice Craft Battle Bracelet (optional): 4 Iron, 2 Gold, 2 Diamond
    function craftBattleBracelet() external {
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Iron, 4);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Gold, 2);
        resourceNFT.burnResource(msg.sender, ResourceNFT1155.Resource.Diamond, 2);
        itemNFT.mintItem(msg.sender, 4);
    }
}
