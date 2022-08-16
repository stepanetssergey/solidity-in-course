pragma solidity ^0.8.4;

contract calculationAmounts {
function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
       
        uint amountInWithFee = amountIn * 997;
        uint numerator = amountInWithFee * reserveOut;
        uint denominator = reserveIn *1000 + amountInWithFee;
        amountOut = numerator / denominator;
    }
}