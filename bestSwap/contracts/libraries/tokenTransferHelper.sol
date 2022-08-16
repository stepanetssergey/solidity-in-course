pragma solidity ^0.8.4;

import "../interfaces/IERC20.sol";

contract tokenTransferHelper {

     function transferFromToken(
        address _token,
        address _from,
        address _to,
        uint256 _value
    ) public {
        IERC20 ERC20 = IERC20(_token);
        ERC20.transferFrom(_from, _to, _value);
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
}