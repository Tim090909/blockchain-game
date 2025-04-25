// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MagicToken - ERC20 game currency
/// @author Hrynchuk T.
/// @notice Fungible token used for game marketplace
contract MagicToken is ERC20, Ownable {
    address public minter;

    /// @notice Deploy MagicToken ERC20
    constructor() ERC20("MagicToken", "MAGIC") Ownable(msg.sender) {}

    /// @notice Set the minter address
    /// @param _minter Address allowed to mint tokens
    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    /// @notice Mint new tokens
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter");
        _mint(to, amount);
    }
}
