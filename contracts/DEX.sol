// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {
    IERC20 public immutable abxToken;
    IERC20 public immutable comToken;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(address _abxToken, address _comToken) {
        require(
            _abxToken != address(0) && _comToken != address(0)
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
            _tokenIn == address(abxToken) || _tokenIn == address(comToken)
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
            _tokenIn == address(abxToken) || _tokenIn == address(comToken)
        );
        require(_amountIn > 0);

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

    function addInitialAbx() external {
        require(getAbxReserve() == 0);
        abxToken.transferFrom(msg.sender, address(this), 10000);
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
                abxReserve * _comAmount == comReserve * _abxAmount
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
        require(shares > 0);
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