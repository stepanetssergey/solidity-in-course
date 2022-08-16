// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

interface IPair {
    function mint(address _to) external returns (uint256 liquidity);
    function getReserves()
        external
        view
        returns (uint256 _reserve0, uint256 _reserve1);
    function swap(uint amount0Out, uint amount1Out, address to) external;
}