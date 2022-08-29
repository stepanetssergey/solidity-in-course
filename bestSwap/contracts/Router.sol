// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "./interfaces/IPairFactory.sol";
import "./interfaces/IPair.sol";
import "./libraries/Library.sol";
import "./interfaces/IWETH.sol";

contract Router is Library {
    address public factory;
    address public WETH;

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH = _WETH;
    }

    function addLiquidity(
        address _token0,
        address _token1,
        uint256 _amount0,
        uint256 _amount1,
        address _to
    )
        public
        returns (
            uint256 amount0,
            uint256 amount1,
            uint256 liquidity
        )
    {
        IPairFactory _pairFactory = IPairFactory(factory);
        if (_pairFactory.getPairAddress(_token0, _token1) == address(0)) {
            _pairFactory.createPair(_token0, _token1);
        }

        address _pairAddress = _pairFactory.getPairAddress(_token0, _token1);

        transferFromToken(_token0, msg.sender, _pairAddress, _amount0);
        transferFromToken(_token1, msg.sender, _pairAddress, _amount1);
        liquidity = IPair(_pairAddress).mint(_to);
    }

    function addLiquidityETH(
        address token,
        uint256 _amountToken,
        uint256 _amountETH,
        address to
    ) public payable returns (uint256 liquidity) {
        IPairFactory _pairFactory = IPairFactory(factory);

        address _pairAddress = _pairFactory.getPairAddress(token, WETH);

        if (_pairAddress == address(0)) {
            _pairFactory.createPair(token, WETH);
            _pairAddress = _pairFactory.getPairAddress(token, WETH);
        }

        transferFromToken(token, msg.sender, _pairAddress, _amountToken);
        console.log("--------------", _amountETH, "--------------");
        IWETH(WETH).deposit{value: msg.value}();
        assert(IWETH(WETH).transfer(_pairAddress, msg.value));
        liquidity = IPair(_pairAddress).mint(to);
        // refund dust eth, if any
        // if (msg.value > _amountETH)
        //     safeTransferETH(msg.sender, msg.value - _amountETH);
    }

    function removeLiquidity(
        address _token0,
        address _token1,
        uint256 _liquidity,
        address _to
    ) public {
        IPairFactory _pairFactory = IPairFactory(factory);
        address _pairAddress = _pairFactory.getPairAddress(_token0, _token1);
        IPair(_pairAddress).transferFrom(msg.sender, _pairAddress, _liquidity);
        IPair(_pairAddress).burn(_to);
    }

    function swap(
        uint256[] memory amounts,
        address[] memory path,
        address _to
    ) public {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = sortTokens(input, output);
            address _pairAddress = IPairFactory(factory).getPairAddress(
                path[i],
                path[i + 1]
            );
            (uint256 _reserve0, uint256 _reserve1) = IPair(_pairAddress)
                .getReserves();
            uint256 amountOut = _getAmountOut(amounts[i], _reserve0, _reserve1);
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            IPair(_pairAddress).swap(amount0Out, amount1Out, _to);
        }
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        address[] calldata path,
        address to
    ) public returns (uint256[] memory amounts) {
        amounts = getAmountsOut(factory, amountIn, path);
        address _pairAddress = IPairFactory(factory).getPairAddress(
            path[0],
            path[1]
        );
        IERC20(path[0]).transferFrom(msg.sender, _pairAddress, amounts[0]);
        swap(amounts, path, to);
    }

    function _getAmountOut(
        uint256 _amountIn,
        uint256 _reserve0,
        uint256 _reserve1
    ) public pure returns (uint256 amountOut) {
        amountOut = getAmountOut(_amountIn, _reserve0, _reserve1);
    }
}
