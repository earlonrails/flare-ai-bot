// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IFlashLoanProvider.sol"; // Interface for SparkDEX or RainDEX flash loan provider
import "./IDEX.sol"; // Interface for swapping on SparkDEX and RainDEX

contract FlashArbitrageExecutor is ReentrancyGuard {
    address public owner;

    IFlashLoanProvider public flashLoanProvider;
    IDEX public sparkDEX;
    IDEX public rainDEX;

    constructor(address _flashLoanProvider, address _sparkDEX, address _rainDEX) {
        owner = msg.sender;
        flashLoanProvider = IFlashLoanProvider(_flashLoanProvider);
        sparkDEX = IDEX(_sparkDEX);
        rainDEX = IDEX(_rainDEX);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function initiateFlashLoan(address token, uint256 amount) external onlyOwner nonReentrant {
        // Request flash loan
        flashLoanProvider.initiateFlashLoan(token, amount, address(this));
    }

    function executeArbitrageTrade(address token, uint256 amount) external {
        // Get price differences
        uint256 priceOnSpark = sparkDEX.getPrice(token);
        uint256 priceOnRain = rainDEX.getPrice(token);

        if (priceOnSpark < priceOnRain) {
            // Buy low on SparkDEX, sell high on RainDEX
            sparkDEX.swap(token, amount);
            rainDEX.swap(token, amount);
        } else if (priceOnRain < priceOnSpark) {
            // Buy low on RainDEX, sell high on SparkDEX
            rainDEX.swap(token, amount);
            sparkDEX.swap(token, amount);
        }

        // Repay the flash loan
        repayLoan(token, amount);
    }

    function repayLoan(address token, uint256 amount) internal {
        IERC20(token).transfer(address(flashLoanProvider), amount);
    }

    function checkProfitability(uint256 initialBalance, uint256 finalBalance) internal pure returns (bool) {
        return finalBalance > initialBalance;
    }
}
