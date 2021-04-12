// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0;
import './ERC721Full.sol';
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists;

    constructor() ERC721Full('Color', 'COLOR') public {
    }

    function mint(string memory _color) public {
        require(!_colorExists[_color]);
        uint _id = colors.push(_color);
        _colorExists[_color] = true;
        _mint(msg.sender, _id);
    }
}

/*
INSTRUCTIONS TO MINT NEW TOKENS
1. truffle console
2. contract = await Color.deployed()
3. await contract.mint('#387c6d')
*/

