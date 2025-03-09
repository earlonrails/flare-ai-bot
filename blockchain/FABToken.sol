// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FABToken is ERC20, Ownable {
    // Price of 1 FAB in C2FLR (initially 1:1, adjustable by bot profits)
    uint256 public tokenPrice; // In wei (e.g., 1e18 = 1 C2FLR)
    uint256 public constant INITIAL_PRICE = 1 ether; // 1 FAB = 1 C2FLR initially

    // Event for deposits
    event Deposited(
        address indexed user,
        uint256 c2flrAmount,
        uint256 fabAmount
    );

    // Constructor sets initial token price and ERC20 details
    constructor() ERC20("Flare Arbitrage Bot", "FAB") Ownable(msg.sender) {
        tokenPrice = INITIAL_PRICE;
    }

    // Deposit C2FLR to receive FAB tokens
    function deposit() external payable {
        require(msg.value > 0, "Must send C2FLR to deposit");

        // Calculate FAB tokens to mint (based on current price)
        uint256 fabAmount = (msg.value * 1 ether) / tokenPrice; // Adjust for decimals
        _mint(msg.sender, fabAmount);

        emit Deposited(msg.sender, msg.value, fabAmount);
    }

    // Update token price based on bot profits (called by bot owner)
    function updatePrice(uint256 newPrice) external onlyOwner {
        require(
            newPrice >= INITIAL_PRICE,
            "Price cannot drop below initial value"
        );
        tokenPrice = newPrice;
    }

    // Check contract balance (for transparency)
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Add to FABToken.sol after the existing code
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Override transferFrom to allow FABPayback to burn tokens
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        if (recipient == address(this)) {
            _burn(sender, amount); // Burn if sent to contract itself
        } else {
            _transfer(sender, recipient, amount);
        }
        return true;
    }
}
