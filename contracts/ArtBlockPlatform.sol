// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "./ABXToken.sol";
import "./Community.sol";

contract ArtBlockPlatform is Ownable {
    IERC20 public immutable abxToken;
    address public exclusiveNTT;

    // 1 Ether = 1000000 ABX
    // Cost of creating a community = 100 ABX

    constructor(address _ntt) Ownable() {
        ABXToken _abxToken = new ABXToken();
        abxToken = IERC20(address(_abxToken));
        abxToken.approve(address(this), abxToken.totalSupply());
        exclusiveNTT = _ntt;
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
            abxToken.transfer(msg.sender, (msg.value * 1000000) / 1 ether)
        );
    }

    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Community creation
    address[] public communities;
    mapping(string => bool) public communityCreated;
    uint256 communityIndexCount;

    function createCommunity(
        string memory title,
        string memory token,
        string memory syntax,
        string memory description
    ) external {
        require(
            communityCreated[syntax] == false
        );
        require(
            abxToken.transferFrom(msg.sender, address(this), 1000)
        );

        communities.push(address(new Community(
            msg.sender,
            title,
            token,
            syntax,
            description,
            address(abxToken),
            exclusiveNTT
        )));

        communityCreated[syntax] = true;
    }
}