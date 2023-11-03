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

contract ArtBlockPlatform is Ownable {
    IERC20 public immutable abxToken;

    constructor() Ownable() {
        ABXToken _abxToken = new ABXToken();
        abxToken = IERC20(address(_abxToken));
        abxToken.approve(address(this), abxToken.totalSupply());
    }

    // Ether to ABX
    function getReserve() public view returns (uint256) {
        return IERC20(abxToken).balanceOf(address(this));
    }

    function getAbxBalance() public view returns (uint256) {
        return IERC20(abxToken).balanceOf(address(msg.sender));
    }

    function purchaseABX() public payable {
        require(msg.value > 0);
        require(
            abxToken.transfer(msg.sender, (msg.value * 10000) / 1 ether)
        );
    }

    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

