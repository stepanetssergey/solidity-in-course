// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./interfaces/IPairFactory.sol";
import "./libraries/tokenTransferHelper.sol";
import "./interfaces/IPair.sol";
import "./libraries/calculationAmounts.sol";


contract Router is tokenTransferHelper, calculationAmounts {
    
    address public factory;
    constructor(address _factory) {
         factory = _factory;
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
        if(_pairFactory.getPairAddress(_token0, _token1) == address(0)) {
            _pairFactory.createPair(_token0, _token1);
        }

        address _pairAddress = _pairFactory.getPairAddress(_token0, _token1);

        transferFromToken(_token0, msg.sender, _pairAddress, _amount0);
        transferFromToken(_token1, msg.sender, _pairAddress, _amount1);
        liquidity = IPair(_pairAddress).mint(_to);
    }

    function swap(uint _amountIn, address _token0, address _token1, address _to) public {
        address _pairAddress = IPairFactory(factory).getPairAddress(_token0, _token1);
        (uint _reserve0, uint _reserve1) = IPair(_pairAddress).getReserves();
        uint amountOut = getAmountOut(_amountIn, _reserve0, _reserve0);
        IERC20(_token0).transferFrom(msg.sender, _pairAddress, _amountIn);
        IPair(_pairAddress).swap(0, amountOut, _to);
    }


    function getAmountOut(uint _amountIn, address _token0, address _token1) public view returns(uint amountOut) {
        address _pairAddress = IPairFactory(factory).getPairAddress(_token0, _token1);
        (uint _reserve0, uint _reserve1) = IPair(_pairAddress).getReserves();
        amountOut = getAmountOut(_amountIn, _reserve0, _reserve1);
    }


}