// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TradingBalance {
    // Custom errors
    error ZeroAmount();
    error InsufficientBalance();
    error InvalidRecipient();

    mapping(address => uint256) private balances;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);
    
    // Deposit funds into the contract
    function deposit() external payable {
        if (msg.value == 0) revert ZeroAmount();
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    // Withdraw funds from the contract
    function withdraw(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    // Transfer funds between users inside the contract
    function transfer(address to, uint256 amount) external {
        if (to == address(0)) revert InvalidRecipient();
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transferred(msg.sender, to, amount);
    }
    
    // Get balance of a user
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
