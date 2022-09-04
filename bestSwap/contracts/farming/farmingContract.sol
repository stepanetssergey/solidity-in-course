pragma solidity ^0.8.4;

import "../interfaces/IERC20.sol";
import "hardhat/console.sol";


contract farmingContract {

    struct pool {
        uint lastBlock;
        uint tokensPerOneLPToken;
        uint tokensForOneBlock;
        address LPAddress;
        address rewardAddress;
    }

    struct user {
        uint rewardDebt;
        uint amount;
    }

    pool public Pool;

    mapping(address => user) public Users;

    constructor(uint _tokensForOneBlock, address _LPAddress, address _rewardAddress) {
        Pool.tokensForOneBlock = _tokensForOneBlock;
        Pool.LPAddress = _LPAddress;
        Pool.rewardAddress = _rewardAddress;
    }
    
    function deposit(uint256 _amount) public {
        updatePool();
        if (Users[msg.sender].amount > 0) {
            uint256 pending = Users[msg.sender].amount * Pool.tokensPerOneLPToken / 1e12 - Users[msg.sender].rewardDebt;
            if(pending > 0) {
                IERC20(Pool.rewardAddress).mint(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            IERC20(Pool.LPAddress).transferFrom(msg.sender, address(this), _amount);
            Users[msg.sender].amount += _amount;
        }
        Users[msg.sender].rewardDebt = Users[msg.sender].amount * Pool.tokensPerOneLPToken / 1e12;
        // emit Deposit(msg.sender, _pid, _amount);
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool() public {
        
        if (block.number <= Pool.lastBlock) {
            return;
        }
        // start of farming pool
        uint256 lpSupply = IERC20(Pool.LPAddress).balanceOf(address(this));
        if (lpSupply == 0) {
            Pool.lastBlock = block.number;
            return;
        }
        
        uint blockAmount = block.number - Pool.lastBlock;

        Pool.tokensPerOneLPToken = Pool.tokensPerOneLPToken + ((blockAmount * Pool.tokensForOneBlock) * 1e12) / lpSupply;
        Pool.lastBlock = block.number;
    }

    // View function to see pending CAKEs on frontend.
    function pendingAmount(address _user) external view returns (uint256) {
        uint256 lpSupply = IERC20(Pool.LPAddress).balanceOf(address(this));
        uint tokensPerLPToken;

        if (block.number > Pool.lastBlock && lpSupply != 0) {
            uint blockAmount = block.number - Pool.lastBlock;
            uint tokensAmount = blockAmount * Pool.tokensForOneBlock;
            tokensPerLPToken = Pool.tokensPerOneLPToken + (tokensAmount * 1e12) / lpSupply;
        }
        return (Users[_user].amount * tokensPerLPToken) / 1e12 - Users[_user].rewardDebt;
    }


    function withdraw(uint _amount) public {
        updatePool();
        uint256 pending = Users[msg.sender].amount * Pool.tokensPerOneLPToken / 1e12 - Users[msg.sender].rewardDebt;
        if(pending > 0) {
            IERC20(Pool.rewardAddress).mint(msg.sender, pending);
        }
        IERC20(Pool.LPAddress).transfer(msg.sender, Users[msg.sender].amount);
        Users[msg.sender].amount -= _amount;
        Users[msg.sender].rewardDebt = Users[msg.sender].amount * Pool.tokensPerOneLPToken / 1e12;
    }
}
