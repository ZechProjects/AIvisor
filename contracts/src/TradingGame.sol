// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TradingGame {
    // Custom errors
    error OnlyOwner();
    error UserAlreadyRegistered();
    error UserNotRegistered();
    error InsufficientUSDTBalance();
    error InsufficientCryptoBalance();
    error InvalidTradeType();

    struct UserPortfolio {
        uint256 usdtBalance; // USDT balance of the user
        mapping(string => uint256) holdings; // Crypto holdings (e.g., BTC => 0.5, ETH => 2)
        bool exists; // Check if the user exists
    }

    mapping(address => UserPortfolio) private userPortfolios; // Mapping of users to their portfolios
    address public owner;

    event TradeExecuted(address indexed user, string crypto, string tradeType, uint256 amount, uint256 price);
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Initialize user with dummy USDT
    function registerUser() public {
        if (userPortfolios[msg.sender].exists) revert UserAlreadyRegistered();
        userPortfolios[msg.sender].usdtBalance = 10000 * 1e18; // Example: Start with 10,000 USDT
        userPortfolios[msg.sender].exists = true;
    }

    // Function to execute trades
    function executeTrade(string memory crypto, string memory tradeType, uint256 amount, uint256 price) public {
        if (!userPortfolios[msg.sender].exists) revert UserNotRegistered();
        UserPortfolio storage user = userPortfolios[msg.sender];

        uint256 tradeValue = amount * price;

        if (keccak256(abi.encodePacked(tradeType)) == keccak256(abi.encodePacked("BUY"))) {
            if (user.usdtBalance < tradeValue) revert InsufficientUSDTBalance();

            user.usdtBalance -= tradeValue; // Deduct USDT
            user.holdings[crypto] += amount; // Add crypto to holdings
        } 
        else if (keccak256(abi.encodePacked(tradeType)) == keccak256(abi.encodePacked("SELL"))) {
            if (user.holdings[crypto] < amount) revert InsufficientCryptoBalance();

            user.holdings[crypto] -= amount; // Deduct crypto
            user.usdtBalance += tradeValue; // Add USDT
        } 
        else {
            revert InvalidTradeType();
        }

        emit TradeExecuted(msg.sender, crypto, tradeType, amount, price);
    }

    // Function to check user portfolio (USDT + Holdings)
    function getUserPortfolio(address userAddress, string memory crypto) public view returns (uint256 usdtBalance, uint256 cryptoBalance) {
        if (!userPortfolios[userAddress].exists) revert UserNotRegistered();
        UserPortfolio storage user = userPortfolios[userAddress];

        return (user.usdtBalance, user.holdings[crypto]);
    }
}
