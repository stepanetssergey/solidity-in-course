// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract Auction {
    uint256 public auctionId;

    struct auction {
        address owner;
        address collection;
        uint256 tokenId;
        uint256 startBid;
        uint256 endBid;
        uint256 startTime;
        uint256 endTime;
        address winner;
    }

    mapping(uint256 => auction) public getAuction;

    function addToken(uint256 tokenId, uint256 startBid, address collection, uint256 endTime) public {
        require(endTime > block.timestamp, 'End time must be higher than start time');
        auctionId += 1;
        getAuction[auctionId].owner = msg.sender;
        getAuction[auctionId].tokenId = tokenId;
        getAuction[auctionId].collection = collection;
        getAuction[auctionId].startBid = startBid;
        getAuction[auctionId].startTime = block.timestamp;
        getAuction[auctionId].endTime = endTime;
        IERC721(collection).transferFrom(msg.sender, address(this), tokenId);
    }

    function addBid(uint256 auctionId) public payable {
        uint256 value = msg.value;

        require(value > getAuction[auctionId].endBid, "Value should be higher than last bid");
        require(block.timestamp <= getAuction[auctionId].endTime, 'Auction is over');
        require(block.timestamp >= getAuction[auctionId].startTime, 'Auction has not started');

        if (address(0) == getAuction[auctionId].winner) {
            getAuction[auctionId].winner = msg.sender;
            getAuction[auctionId].endBid = value;
        } else {
            address payable previousWinner = payable(getAuction[auctionId].winner);

            previousWinner.transfer(getAuction[auctionId].endBid);
            getAuction[auctionId].winner = msg.sender;
            getAuction[auctionId].endBid = value;
        }
    }

    function stopAuction(uint256 auctionId) public {
        require(block.timestamp > getAuction[auctionId].startTime, 'Time must be higher than start time');
        require(msg.sender == getAuction[auctionId].owner, 'Not allowed to stop auction');
        getAuction[auctionId].endTime = block.timestamp;
    }

    function withdraw(uint256 auctionId) public {
        require(block.timestamp >= getAuction[auctionId].endTime, 'Auction is not over');
        require(block.timestamp >= getAuction[auctionId].startTime, 'Auction has not started');
        require(address(0) != getAuction[auctionId].winner, 'Invalid winner');
        require(msg.sender == getAuction[auctionId].winner || msg.sender == getAuction[auctionId].owner, 'Not allowed to withdraw');
        IERC721(getAuction[auctionId].collection).transferFrom(address(this), getAuction[auctionId].winner, getAuction[auctionId].tokenId);
    }
}
