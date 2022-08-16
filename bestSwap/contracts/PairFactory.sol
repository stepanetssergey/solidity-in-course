pragma solidity ^0.8.4;
import "./Pair.sol";

contract PairFactory {
    address public pair;
    mapping(address => mapping(address => address)) getPair;
    address[] public allPairs;

    function getPairAddress(address _token0, address _token1) public view returns(address) {
        return getPair[_token0][_token1];
    }

    function getPairLength() public view returns(uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB)
        external
        returns (address _pair)
    {
        require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "PAIR_EXISTS");
        bytes memory bytecode = type(Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            _pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        Pair(_pair).initialize(token0, token1);
        getPair[token0][token1] = _pair;
        getPair[token1][token0] = _pair;
        allPairs.push(_pair);
        pair = _pair;
    }
}
