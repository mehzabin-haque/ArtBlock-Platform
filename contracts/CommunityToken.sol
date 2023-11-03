// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CommunityToken is ERC20 {

    constructor(
        string memory _token,
        string memory _syntax
    ) ERC20(_token, _syntax) {
        _mint(msg.sender, 100000000000000000000 * 10 ** decimals());
    }
}