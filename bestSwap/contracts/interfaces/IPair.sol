// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

interface IPair {
    function mint(address _to) external returns (uint256 liquidity);

    function burn(address _to) external returns (uint amount0, uint amount1);

    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1);

    function swap(uint amount0Out, uint amount1Out, address to) external;

    function transferFrom(address _from, address _to, uint256 _value) external;
}