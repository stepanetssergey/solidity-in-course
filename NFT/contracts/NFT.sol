// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
        _mint(msg.sender, 3);
    }

    function _baseURI() internal view override returns (string memory) {
        return "https://metadata.robocosmic.online/";
    }
}
