pragma solidity ^0.8.4;

import "./interfaces/IERC20.sol";

contract Pair {
    address public factory;
    address public token0;
    address public token1;
    uint256 private reserve0;
    uint256 private reserve1;
    uint256 totalSupply;

    constructor() {
        factory = msg.sender;
        editMinter(factory, true);
    }

    mapping(address => bool) Minters;
    mapping(address => uint256) balance;

    modifier onlyOwner() {
        require(msg.sender == factory, "Only owner");
        _;
    }

    modifier onlyMinter() {
        require(Minters[msg.sender] == true, "Only minters");
        _;
    }

    function editMinter(address _account, bool _active) public onlyOwner {
        Minters[_account] = _active;
    }

    function getReserves()
        public
        view
        returns (uint256 _reserve0, uint256 _reserve1)
    {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
    }

    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "Must be an owner");
        token0 = _token0;
        token1 = _token1;
    }

    function mint(address _to) internal returns (uint256 liquidity) {
        IERC20 ERC20Token0 = IERC20(token0);
        IERC20 ERC20Token1 = IERC20(token1);
        (uint256 _reserve0, uint256 _reserve1) = getReserves();
        uint256 balance0 = ERC20Token0.balanceOf(address(this));
        uint256 balance1 = ERC20Token1.balanceOf(address(this));
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        if (totalSupply == 0) {
            liquidity = sqrt(amount0 * amount1) - 10**3;
            _mint(address(0), 10**3);
        } else {
            liquidity = min(
                (amount0 * totalSupply) / reserve0,
                (amount1 * totalSupply) / reserve1
            );
        }

        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(_to, liquidity);
        _update(balance0, balance1);
    }

    function _mint(address _to, uint256 _value) internal {
        totalSupply += _value;
        balance[_to] += _value;
    }

    function _update(uint _balance0, uint _balance1) private {
        reserve0 = uint112(_balance0);
        reserve1 = uint112(_balance1);
    }

    function transferFromToken(
        address _token,
        address _from,
        address _to,
        uint256 _value
    ) internal {
        IERC20 ERC20 = IERC20(_token);
        ERC20.transferFrom(_from, _to, _value);
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
        transferFromToken(_token0, msg.sender, address(this), _amount0);
        transferFromToken(_token1, msg.sender, address(this), _amount1);
        liquidity = mint(_to);
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

    function balanceOf(address _account) public view returns (uint256) {
        return balance[_account];
    }
}
