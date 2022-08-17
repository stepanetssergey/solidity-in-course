pragma solidity ^0.8.4;

import '../interfaces/IPairFactory.sol';
import '../interfaces/IPair.sol';
import '../interfaces/IERC20.sol';

contract Library {

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) internal pure returns (uint256 amountOut) {
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * 1000 + amountInWithFee;
        amountOut = numerator / denominator;
    }

    function getAmountsOut(address factory, uint256 amountIn, address[] memory path) internal view  returns (uint256[] memory amounts) {
        require(path.length >= 2, "INVALID_PATH");

        amounts = new uint256[](path.length);
        amounts[0] = amountIn;

        for (uint256 i; i < path.length - 1; i++) {
            address _pairAddress = IPairFactory(factory).getPairAddress(path[i], path[i + 1]);
            (uint256 reserveIn, uint256 reserveOut) = IPair(_pairAddress).getReserves();
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
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

    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x < y ? x : y;
    }

    function sortTokens(address tokenA, address tokenB) public pure returns(address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }

    function transferFromToken(
        address _token,
        address _from,
        address _to,
        uint256 _value
    ) public {
        IERC20 ERC20 = IERC20(_token);
        ERC20.transferFrom(_from, _to, _value);
    }
}
