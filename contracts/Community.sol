// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./CommunityToken.sol";
import "./ArtNFT.sol";
import "./DEX.sol";

contract Community {
    address public creator;
    string public title;
    string public token;
    string public syntax;
    string public description;
    IERC20 public immutable abxToken;
    CommunityToken public comToken;
    ArtNFT public artNFT;
    address public dex;
    IExclusiveArt public exclusiveNTT;

    constructor (
        address _creator,
        string memory _title,
        string memory _token,
        string memory _syntax,
        string memory _description,
        address _abxToken,
        address _exclusiveNTT
    ) {
        creator = _creator;
        title = _title;
        token = _token;
        description = _description;
        comToken = new CommunityToken(_token, _syntax);
        comToken.approve(address(this), comToken.totalSupply());
        abxToken = IERC20(_abxToken);
        dex = initiateDEX();
        artNFT = new ArtNFT();
        exclusiveNTT = IExclusiveArt(_exclusiveNTT);
    }

    function initiateDEX() internal returns (address dexAddress) {
        require(dex == address(0));

        DEX _dex = new DEX(address(abxToken), address(comToken));
        dexAddress = address(_dex);
        comToken.transfer(dexAddress, comToken.totalSupply());
    }

    // ---------------------------
    // Artwork Minting and Auction creation and bidding
    struct Artwork {
        string name;
        uint price;
        address artist;
        uint nftTokenId;
        uint royalty;
    }

    Artwork[] public artworks;
    mapping(uint256 => Artwork) public artInfo;

    event ArtVoted(uint256 proposalId, address voter, int256 vote);
    event ArtMinted(uint256 proposalId, uint256 tokenId);

    function mintArt(uint proposalId, string memory _name, uint _price) public {
        require(artProposals[proposalId].winner == true);
        Artwork storage artwork = artworks.push();
        artwork.name = _name;
        artwork.price = _price;
        artwork.artist = msg.sender;
        uint256 tokenId = artNFT.safeMint(msg.sender);
        artInfo[tokenId] = artwork;
    }

    function setArtist(uint256 _tokenId) public {
        require(
            artInfo[_tokenId].artist == address(0)
        );
        artInfo[_tokenId].artist = msg.sender;
    }

    // ---------------------------------------------------------------------------------
    // ArtProposal
    struct ArtProposal {
        address artist;
        uint upvotes;
        uint downvotes;
        uint closingTime;
        bool isMinted;
        bool threshold;
        string name;
        bool isExclusive;
        bool winner;
    }

    mapping (uint => ArtProposal) public artProposals;
    uint public proposalCounter;

    event ArtProposed(uint256 proposalId, string name, address owner);
    // Voting period = 10 mins
    // Upvote and Downvote threshold = 3
    // Stake to propose art = 100 Community Tokens

    function proposeArt(string memory _name, bool _isExclusive) public {
        require(comToken.transferFrom(msg.sender, address(this), 100));
        artProposals[proposalCounter] = ArtProposal({
            artist: msg.sender,
            upvotes: 0,
            downvotes: 0,
            closingTime: block.timestamp + 600,
            isMinted: false,
            threshold: false,
            name: _name,
            isExclusive: _isExclusive,
            winner: false
        });

        emit ArtProposed(proposalCounter, _name, msg.sender);
        proposalCounter++;
    }

    function upvote(uint proposalId) external {
        ArtProposal storage _artProposal = artProposals[proposalId];
        require(_artProposal.closingTime < block.timestamp);
        
        uint weight = (1 ether * comToken.balanceOf(msg.sender) / comToken.totalSupply());
        _artProposal.upvotes += weight;
    }

    function downvote(uint proposalId) external {
        ArtProposal storage _artProposal = artProposals[proposalId];
        require(_artProposal.closingTime < block.timestamp);
        
        uint weight = (1 ether * comToken.balanceOf(msg.sender) / comToken.totalSupply());
        _artProposal.downvotes += weight;
    }

    function generateVotingResult(uint proposalId) external returns (bool) {
        ArtProposal storage _artProposal = artProposals[proposalId];

        require(
            _artProposal.closingTime > block.timestamp
        );

        if (_artProposal.upvotes > _artProposal.downvotes) {
            require(_artProposal.isMinted == false);
            require(comToken.transfer(_artProposal.artist, 100));
            _artProposal.winner = true; 
            return true;
        }
        else {
            return false;
        } 
    }

    struct Auction {
        Artwork artwork;
        uint start;
        uint decrement; //decrement is in minutes
        uint interval;
        uint minprice;
        address artist;
        address winner;
        uint startTime;
    }

    Auction[] public auctions;
    mapping(uint => Auction) auctionMap;
    uint public auctionIndex;

    function createDutchAuction(Artwork memory _artwork, uint _start, uint _decrement, uint _interval, uint _minprice) external {
        Auction storage auction = auctions.push();
        auction.artwork = _artwork;
        auction.start = _start;
        auction.decrement = _decrement * 60; //decrement is in minutes, multiplied by 60 to convert to seconds
        auction.interval = _interval;
        auction.minprice = _minprice;
        auction.artist = msg.sender;
        auction.startTime = block.timestamp;

        auctionMap[auctionIndex++] = auction;
    }

    mapping (uint => Artwork) exclusiveArtIndex;

    function placeBid(uint _auctionId) external {
        Auction storage auction = auctionMap[_auctionId];
        uint currentPrice = auction.start - (auction.decrement * (block.timestamp - auction.start) / auction.interval);

        require (
            comToken.transferFrom(msg.sender, auction.artwork.artist, currentPrice)
        );

        uint id = exclusiveNTT.safeMint(msg.sender);
        exclusiveArtIndex[id] = auction.artwork;
        artNFT.burn(auction.artwork.nftTokenId);
    }

    struct Sellpost {
        Artwork artwork;
        uint price;
        bool isResell;
        uint id;
        bool isSold;
    }

    uint public sellpostid;

    Sellpost[] public sellposts;
    
    function createSellPost (uint _id, uint _royalty, uint _price) external {
        Artwork storage _artwork = artInfo[_id];
        _artwork.royalty = _royalty;
        Sellpost storage _sellpost = sellposts.push();
        _sellpost.id = sellpostid++;
        _sellpost.price = _price;
        _sellpost.artwork = _artwork;
        _sellpost.isResell = (artNFT.ownerOf(_artwork.nftTokenId) == _artwork.artist)? false : true;
    }

    function getSellpost(uint256 _id)
        public
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < sellposts.length; i++) {
            if (sellposts[i].id == _id) {
                return i;
            }
        }
        revert("Sellpost not found");
    }

    function buyFromMarket (uint _id) external {
        Sellpost storage _sellpost = sellposts[getSellpost(_id)];
        require(comToken.transferFrom(msg.sender, artNFT.ownerOf(_sellpost.artwork.nftTokenId), _sellpost.price - (_sellpost.price * _sellpost.artwork.royalty / 100 )), "Community Token transfer to owner failed!");
        require(comToken.transferFrom(msg.sender, _sellpost.artwork.artist, _sellpost.price * _sellpost.artwork.royalty / 100 ), "Community Token transfer to artist failed!");

        _sellpost.isSold = true;
    }

}

interface IExclusiveArt is IERC721 {
    function safeMint(address to) external returns (uint);
}