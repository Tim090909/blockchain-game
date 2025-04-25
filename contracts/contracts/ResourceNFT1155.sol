// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ResourceNFT1155 - ERC1155 Resources
/// @author Hrynchuk T.
/// @notice ERC1155 for resource tokens (wood, iron, gold, etc.)
contract ResourceNFT1155 is ERC1155, Ownable {
    enum Resource { Wood, Iron, Gold, Leather, Stone, Diamond }
    uint256 public constant NUM_RESOURCES = 6;
    address public minter;

    /// @notice Constructor for ResourceNFT1155
    constructor() ERC1155("https://game.example/api/resource/{id}.json") Ownable(msg.sender) {}

    /// @notice Set the minter address
    /// @param _minter Address allowed to mint resources
    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    /// @notice Mint resources (only by minter)
    /// @param to Recipient address
    /// @param resource Resource type
    /// @param amount Amount to mint
    function mintResource(address to, Resource resource, uint256 amount) external {
        require(msg.sender == minter, "Only minter");
        require(uint256(resource) < NUM_RESOURCES, "Invalid resource");
        _mint(to, uint256(resource), amount, "");
    }

    /// @notice Burn resources (only by minter)
    /// @param from Address to burn from
    /// @param resource Resource type
    /// @param amount Amount to burn
    function burnResource(address from, Resource resource, uint256 amount) external {
        require(msg.sender == minter, "Only minter");
        require(uint256(resource) < NUM_RESOURCES, "Invalid resource");
        _burn(from, uint256(resource), amount);
    }
}
