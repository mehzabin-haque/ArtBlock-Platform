// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ABXToken is ERC20, ERC20Permit, Ownable {
    constructor() ERC20("ArtBlockToken", "ABX") ERC20Permit("ArtBlockToken") Ownable() {
        _mint(msg.sender, 100000000000000000000 * 10 ** decimals());
    }
}