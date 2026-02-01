// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SubscriptionBadge
 * @dev ERC1155 badge contract for subscription tiers
 */
contract SubscriptionBadge is ERC1155, Ownable {
    string public name = "DreamNet Subscription Badge";
    string public symbol = "DNSB";

    // Mapping from token ID to custom token URI
    mapping(uint256 => string) private _tokenURIs;
    address public minter;

    event MinterUpdated(address indexed newMinter);
    event TokenURISet(uint256 indexed tokenId, string uri);

    constructor(string memory defaultURI, address initialOwner) ERC1155(defaultURI) Ownable(initialOwner) {}

    modifier onlyMinter() {
        require(msg.sender == minter, "SubscriptionBadge: caller is not the minter");
        _;
    }

    function setMinter(address newMinter) external onlyOwner {
        minter = newMinter;
        emit MinterUpdated(newMinter);
    }

    function setTokenURI(uint256 tokenId, string calldata newUri) external {
        require(
            msg.sender == owner() || msg.sender == minter,
            "SubscriptionBadge: not authorized"
        );
        _tokenURIs[tokenId] = newUri;
        emit TokenURISet(tokenId, newUri);
        emit URI(newUri, tokenId);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenUri = _tokenURIs[tokenId];
        if (bytes(tokenUri).length > 0) {
            return tokenUri;
        }
        return super.uri(tokenId);
    }

    function mint(address to, uint256 id) external onlyMinter {
        _mint(to, id, 1, "");
    }

    function burn(address from, uint256 id) external onlyMinter {
        _burn(from, id, 1);
    }
}
