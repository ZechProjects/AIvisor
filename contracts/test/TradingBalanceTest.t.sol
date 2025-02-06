// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {TradingBalance} from "../src/TradingBalance.sol";

contract TradingBalanceTest is Test {
    TradingBalance public tradingBalance;
    address public alice;
    address public bob;
    uint256 public initialBalance = 10 ether;

    function setUp() public {
        tradingBalance = new TradingBalance();
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        
        // Fund alice with some ETH for testing
        vm.deal(alice, initialBalance);
    }

    // Deposit Tests
    function test_Deposit() public {
        vm.startPrank(alice);
        uint256 depositAmount = 1 ether;
        
        tradingBalance.deposit{value: depositAmount}();
        assertEq(tradingBalance.getBalance(alice), depositAmount);
        assertEq(address(tradingBalance).balance, depositAmount);
        vm.stopPrank();
    }

    function test_RevertZeroDeposit() public {
        vm.startPrank(alice);
        vm.expectRevert(TradingBalance.ZeroAmount.selector);
        tradingBalance.deposit{value: 0}();
        vm.stopPrank();
    }

    // Withdrawal Tests
    function test_Withdraw() public {
        // First deposit
        vm.startPrank(alice);
        uint256 depositAmount = 1 ether;
        tradingBalance.deposit{value: depositAmount}();
        
        // Then withdraw
        uint256 balanceBefore = alice.balance;
        tradingBalance.withdraw(depositAmount);
        
        assertEq(tradingBalance.getBalance(alice), 0);
        assertEq(alice.balance, balanceBefore + depositAmount);
        vm.stopPrank();
    }

    function test_RevertWithdrawZeroAmount() public {
        vm.startPrank(alice);
        vm.expectRevert(TradingBalance.ZeroAmount.selector);
        tradingBalance.withdraw(0);
        vm.stopPrank();
    }

    function test_RevertInsufficientBalance() public {
        vm.startPrank(alice);
        vm.expectRevert(TradingBalance.InsufficientBalance.selector);
        tradingBalance.withdraw(1 ether);
        vm.stopPrank();
    }

    // Transfer Tests
    function test_Transfer() public {
        // First deposit as alice
        vm.startPrank(alice);
        uint256 depositAmount = 1 ether;
        tradingBalance.deposit{value: depositAmount}();
        
        // Then transfer to bob
        uint256 transferAmount = 0.5 ether;
        tradingBalance.transfer(bob, transferAmount);
        
        assertEq(tradingBalance.getBalance(alice), depositAmount - transferAmount);
        assertEq(tradingBalance.getBalance(bob), transferAmount);
        vm.stopPrank();
    }

    function test_RevertTransferZeroAmount() public {
        vm.startPrank(alice);
        vm.expectRevert(TradingBalance.ZeroAmount.selector);
        tradingBalance.transfer(bob, 0);
        vm.stopPrank();
    }

    function test_RevertTransferInsufficientBalance() public {
        vm.startPrank(alice);
        vm.expectRevert(TradingBalance.InsufficientBalance.selector);
        tradingBalance.transfer(bob, 1 ether);
        vm.stopPrank();
    }

    function test_RevertTransferToZeroAddress() public {
        vm.startPrank(alice);
        vm.expectRevert(TradingBalance.InvalidRecipient.selector);
        tradingBalance.transfer(address(0), 1 ether);
        vm.stopPrank();
    }

    // Balance Check Test
    function test_GetBalance() public {
        vm.startPrank(alice);
        uint256 depositAmount = 1 ether;
        tradingBalance.deposit{value: depositAmount}();
        
        assertEq(tradingBalance.getBalance(alice), depositAmount);
        assertEq(tradingBalance.getBalance(bob), 0);
        vm.stopPrank();
    }
}
