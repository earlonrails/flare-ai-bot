// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FABPayback is Ownable {
    IERC20 public fabToken; // FAB token contract
    uint256 public tokenPrice; // Synced with FABToken price

    // Event for withdrawals
    event Withdrawn(address indexed user, uint256 fabAmount, uint256 c2flrAmount);

    // Constructor sets FAB token address
    constructor(address _fabToken) Ownable(msg.sender) {
        fabToken = IERC20(_fabToken);
        tokenPrice = 1 ether; // Initial price, synced manually for MVP
    }

    // Withdraw C2FLR by burning FAB tokens
    function withdraw(uint256 fabAmount) external {
        require(fabAmount > 0, "Must specify FAB amount to burn");
        require(fabToken.balanceOf(msg.sender) >= fabAmount, "Insufficient FAB balance");

        // Calculate C2FLR payout based on current price
        uint256 c2flrAmount = (fabAmount * tokenPrice) / 1 ether; // Adjust for decimals
        require(address(this).balance >= c2flrAmount, "Insufficient contract funds");

        // Burn FAB tokens
        require(fabToken.transferFrom(msg.sender, address(this), fabAmount), "Transfer failed");
        fabToken.burn(fabAmount); // Assumes FABToken has a burn function

        // Send C2FLR to user
        (bool sent, ) = msg.sender.call{value: c2flrAmount}("");
        require(sent, "Failed to send C2FLR");

        emit Withdrawn(msg.sender, fabAmount, c2flrAmount);
    }

    // Update token price (synced with FABToken by bot owner)
    function updatePrice(uint256 newPrice) external onlyOwner {
        tokenPrice = newPrice;
    }

    // Allow contract to receive C2FLR (e.g., bot profits)
    receive() external payable {}

    // Check contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
