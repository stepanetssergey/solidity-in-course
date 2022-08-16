// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;



interface IPairFactory {
    function getPairAddress(address _token0, address _token1) external view returns(address);
    function createPair(address tokenA, address tokenB) external  returns (address _pair);
}