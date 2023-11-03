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

contract ABXToken is ERC20, ERC20Permit, Ownable {
    constructor() ERC20("ArtBlockToken", "ABX") ERC20Permit("ArtBlockToken") Ownable() {
        _mint(msg.sender, 100000000000000000000 * 10 ** decimals());
    }
}

contract ArtBlockPlatform is Ownable {
    IERC20 public immutable abxToken;
    address public exclusiveNTT;

    // 1 Ether = 10000 ABX
    // Cost of creating a community = 100 ABX

    constructor(address _ntt) Ownable(msg.sender) {
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
            abxToken.transfer(msg.sender, (msg.value * 10000) / 1 ether)
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
            communityCreated[syntax] == false,
            "Syntax already exists"
        );
        require(
            abxToken.transferFrom(msg.sender, address(this), 100)
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

contract Community {
    address public creator;
    string public title;
    string public token;
    string public syntax;
    string public description;
    IERC20 public immutable abxToken;
    CommunityToken public immutable comToken;
    ArtNFT public artNFT;
    address public immutable dex;
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
        abxToken = IERC20(_abxToken);
        dex = initiateDEX();
        artNFT = new ArtNFT();
        exclusiveNTT = IExclusiveArt(_exclusiveNTT);
    }

    function initiateDEX() internal returns (address dexAddress) {
        require(dex == address(0), "DEX already initialized!");

        DEX _dex = new DEX(address(abxToken), address(this));
        dexAddress = address(_dex);
    }

    // ---------------------------
    // Artwork Minting and Auction creation and bidding
    struct Artwork {
        string name;
        uint price;
        address artist;
        uint nftTokenId;
    }

    Artwork[] public artworks;
    mapping(uint256 => Artwork) public artInfo;

    event ArtVoted(uint256 proposalId, address voter, int256 vote);
    event ArtMinted(uint256 proposalId, uint256 tokenId);

    function mintArt(uint proposalId, string memory _name, uint _price) public {
        require(artProposals[proposalId].winner == true, "Not approved");
        Artwork storage artwork = artworks.push();
        artwork.name = _name;
        artwork.price = _price;
        artwork.artist = msg.sender;
        uint256 tokenId = artNFT.safeMint(msg.sender);
        artInfo[tokenId] = artwork;
    }

    function setArtist(uint256 _tokenId) public {
        require(
            artInfo[_tokenId].artist == address(0),
            "Artist is already set"
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
        require(comToken.transferFrom(msg.sender, address(this), 100), "Transfer failed");
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
        require(_artProposal.closingTime < block.timestamp, "Voting closed");
        
        uint weight = (1 ether * comToken.balanceOf(msg.sender) / comToken.totalSupply());
        _artProposal.upvotes += weight;
    }

    function downvote(uint proposalId) external {
        ArtProposal storage _artProposal = artProposals[proposalId];
        require(_artProposal.closingTime < block.timestamp, "Voting closed");
        
        uint weight = (1 ether * comToken.balanceOf(msg.sender) / comToken.totalSupply());
        _artProposal.downvotes += weight;
    }

    function generateVotingResult(uint proposalId) external returns (bool) {
        ArtProposal storage _artProposal = artProposals[proposalId];

        require(
            _artProposal.closingTime > block.timestamp,
            "Voting not closed!"
        );

        if (_artProposal.upvotes > _artProposal.downvotes) {
            require(_artProposal.isMinted == false, "Art is already minted");
            require(comToken.transfer(_artProposal.artist, 100), "Transfer failed");
            _artProposal.winner = true; 
            return true;
        }
        else {
            return false;
        } 
    }

    
}

interface IExclusiveArt is IERC721 {
    function safeMint(address to) external returns (uint);
}

contract CommunityToken is ERC20 {

    constructor(
        string memory _token,
        string memory _syntax
    ) ERC20(_token, _syntax) {
        _mint(msg.sender, 100000000000000000000 * 10 ** decimals());
    }
}

contract ArtNFT is ERC721, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("ArtNFT", "ANFT") Ownable() {}

    function safeMint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

contract DEX {
    IERC20 public immutable abxToken;
    IERC20 public immutable comToken;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(address _abxToken, address _comToken) {
        require(
            _abxToken != address(0) && _comToken != address(0),
            "Null token address passed"
        );

        abxToken = IERC20(_abxToken);
        comToken = IERC20(_comToken);
    }

    function getAbxReserve() public view returns (uint256) {
        return IERC20(abxToken).balanceOf(address(this));
    }

    function getComReserve() public view returns (uint256) {
        return IERC20(comToken).balanceOf(address(this));
    }

    function abxToCom(uint256 _amountIn) external returns (uint256 amountOut) {
        amountOut = swap(address(abxToken), _amountIn);
    }

    function comToAbx(uint256 _amountIn) external returns (uint256 amountOut) {
        amountOut = swap(address(comToken), _amountIn);
    }

    function swap(address _tokenIn, uint256 _amountIn)
        internal
        returns (uint256 amountOut)
    {
        require(
            _tokenIn == address(abxToken) || _tokenIn == address(comToken),
            "invalid token"
        );
        require(_amountIn > 0, "amount in = 0");

        bool isAbxToken = _tokenIn == address(abxToken);
        (
            IERC20 tokenIn,
            IERC20 tokenOut,
            uint256 reserveIn,
            uint256 reserveOut
        ) = isAbxToken
                ? (abxToken, comToken, getAbxReserve(), getComReserve())
                : (comToken, abxToken, getComReserve(), getAbxReserve());

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);

        /*
        How much dy for dx?

        xy = k
        (x + dx)(y - dy) = k
        y - dy = k / (x + dx)
        y - k / (x + dx) = dy
        y - xy / (x + dx) = dy
        (yx + ydx - xy) / (x + dx) = dy
        ydx / (x + dx) = dy
        */
        // 0.3% fee
        uint256 amountInWithFee = (_amountIn * 997) / 1000;
        amountOut =
            (reserveOut * amountInWithFee) /
            (reserveIn + amountInWithFee);

        tokenOut.transfer(msg.sender, amountOut);
    }

    function getSwapValue(address _tokenIn, uint256 _amountIn)
        internal view
        returns (uint256 amountOut)
    {
        require(
            _tokenIn == address(abxToken) || _tokenIn == address(comToken),
            "invalid token"
        );
        require(_amountIn > 0, "amount in = 0");

        bool isAbxToken = _tokenIn == address(abxToken);
        (
            
            uint256 reserveIn,
            uint256 reserveOut
        ) = isAbxToken
                ? (getAbxReserve(), getComReserve())
                : (getComReserve(), getAbxReserve());


        /*
        How much dy for dx?

        xy = k
        (x + dx)(y - dy) = k
        y - dy = k / (x + dx)
        y - k / (x + dx) = dy
        y - xy / (x + dx) = dy
        (yx + ydx - xy) / (x + dx) = dy
        ydx / (x + dx) = dy
        */
        // 0.3% fee

        uint256 amountInWithFee = (_amountIn * 997) / 1000;
        amountOut =
            (reserveOut * amountInWithFee) /
            (reserveIn + amountInWithFee);
    }

    function addLiquidity(uint256 _abxAmount, uint256 _comAmount)
        external
        returns (uint256 shares)
    {
        uint256 abxReserve = getAbxReserve();
        uint256 comReserve = getComReserve();

        /*
        How much dx, dy to add?

        xy = k
        (x + dx)(y + dy) = k'

        No price change, before and after adding liquidity
        x / y = (x + dx) / (y + dy)

        x(y + dy) = y(x + dx)
        x * dy = y * dx

        x / y = dx / dy
        dy = y / x * dx
        */
        if (abxReserve > 0 || comReserve > 0) {
            require(
                abxReserve * _comAmount == comReserve * _abxAmount,
                "x / y != dx / dy"
            );
        }

        abxToken.transferFrom(msg.sender, address(this), _abxAmount);
        comToken.transferFrom(msg.sender, address(this), _comAmount);

        /*
        How much shares to mint?

        f(x, y) = value of liquidity
        We will define f(x, y) = sqrt(xy)

        L0 = f(x, y)
        L1 = f(x + dx, y + dy)
        T = total shares
        s = shares to mint

        Total shares should increase proportional to increase in liquidity
        L1 / L0 = (T + s) / T

        L1 * T = L0 * (T + s)

        (L1 - L0) * T / L0 = s 
        */

        /*
        Claim
        (L1 - L0) / L0 = dx / x = dy / y

        Proof
        --- Equation 1 ---
        (L1 - L0) / L0 = (sqrt((x + dx)(y + dy)) - sqrt(xy)) / sqrt(xy)
        
        dx / dy = x / y so replace dy = dx * y / x

        --- Equation 2 ---
        Equation 1 = (sqrt(xy + 2ydx + dx^2 * y / x) - sqrt(xy)) / sqrt(xy)

        Multiply by sqrt(x) / sqrt(x)
        Equation 2 = (sqrt(x^2y + 2xydx + dx^2 * y) - sqrt(x^2y)) / sqrt(x^2y)
                   = (sqrt(y)(sqrt(x^2 + 2xdx + dx^2) - sqrt(x^2)) / (sqrt(y)sqrt(x^2))
        
        sqrt(y) on top and bottom cancels out

        --- Equation 3 ---
        Equation 2 = (sqrt(x^2 + 2xdx + dx^2) - sqrt(x^2)) / (sqrt(x^2)
        = (sqrt((x + dx)^2) - sqrt(x^2)) / sqrt(x^2)  
        = ((x + dx) - x) / x
        = dx / x

        Since dx / dy = x / y,
        dx / x = dy / y

        Finally
        (L1 - L0) / L0 = dx / x = dy / y
        */
        if (totalSupply == 0) {
            shares = _sqrt(_abxAmount * _comAmount);
        } else {
            shares = _min(
                (_abxAmount * totalSupply) / abxReserve,
                (_comAmount * totalSupply) / comReserve
            );
        }
        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);
    }



    function _sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }

    function _mint(address _to, uint256 _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint256 _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }
}