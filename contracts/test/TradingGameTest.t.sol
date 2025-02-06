// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {TradingGame} from "../src/TradingGame.sol";
import {console} from "forge-std/console.sol";

contract TradingGameTest is Test {
    TradingGame public game;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        game = new TradingGame();
    }

    function test_RegisterUser() public {
        vm.startPrank(user1);
        game.registerUser();
        
        (uint256 usdtBalance, uint256 btcBalance) = game.getUserPortfolio(user1, "BTC");
        assertEq(usdtBalance, 10000 * 1e18, "Initial USDT balance should be 10000");
        assertEq(btcBalance, 0, "Initial BTC balance should be 0");
        vm.stopPrank();
    }

    function test_RevertWhenRegisteringTwice() public {
        vm.startPrank(user1);
        game.registerUser();
        
        vm.expectRevert(TradingGame.UserAlreadyRegistered.selector);
        game.registerUser();
        vm.stopPrank();
    }

    function test_ExecuteBuyTrade() public {
        vm.startPrank(user1);
        game.registerUser();
        
        uint256 btcAmount = 0.1 * 1e18; // 0.1 BTC
        uint256 btcPrice = 50000; // $_50,000 per smallest unit of BTC (in smallest unit of USDT)
        
        console.log("BTC Amount (in smallest units):", btcAmount);
        console.log("BTC Price (in USDT wei):", btcPrice);
        console.log("Total Cost (in USDT wei):", btcAmount * btcPrice);

        (uint256 usdtBalanceBefore, uint256 btcBalanceBefore) = game.getUserPortfolio(user1, "BTC");
        console.log("Before trade - USDT Balance (in USDT wei):", usdtBalanceBefore);
        console.log("Before trade - BTC Balance (in smallest units):", btcBalanceBefore);
        
        game.executeTrade("BTC", "BUY", btcAmount, btcPrice);

        (uint256 usdtBalanceAfter, uint256 btcBalanceAfter) = game.getUserPortfolio(user1, "BTC");
        console.log("After trade - USDT Balance:", usdtBalanceAfter);
        console.log("After trade - BTC Balance:", btcBalanceAfter);
        
        assertEq(usdtBalanceAfter, 10000 * 1e18 - (btcAmount * btcPrice), "USDT balance should be reduced");
        assertEq(btcBalanceAfter, btcAmount, "BTC balance should be increased");
        vm.stopPrank();
    }

    function test_ExecuteSellTrade() public {
        vm.startPrank(user1);
        game.registerUser();
        
        // First buy some BTC
        uint256 btcAmount = 0.1 * 1e18; // 0.1 BTC
        uint256 btcPrice = 50000; // $50,000 per BTC
        
        console.log("Initial BTC Buy:");
        console.log("BTC Amount (in smallest units):", btcAmount);
        console.log("BTC Price (in USDT wei):", btcPrice);
        console.log("Total Cost (in USDT wei):", btcAmount * btcPrice);
        
        game.executeTrade("BTC", "BUY", btcAmount, btcPrice);

        // Then sell half of it at a higher price
        uint256 sellAmount = 0.05 * 1e18; // 0.05 BTC
        uint256 sellPrice = 55000; // $55,000 per BTC
        
        console.log("\nSell Transaction:");
        console.log("Sell Amount (in smallest units):", sellAmount);
        console.log("Sell Price (in USDT wei):", sellPrice);
        console.log("Total Return (in USDT wei):", sellAmount * sellPrice);

        (uint256 usdtBalanceBefore, uint256 btcBalanceBefore) = game.getUserPortfolio(user1, "BTC");
        console.log("\nBefore sell - USDT Balance (in USDT wei):", usdtBalanceBefore);
        console.log("Before sell - BTC Balance (in smallest units):", btcBalanceBefore);
        
        game.executeTrade("BTC", "SELL", sellAmount, sellPrice);

        (uint256 usdtBalanceAfter, uint256 btcBalanceAfter) = game.getUserPortfolio(user1, "BTC");
        console.log("\nAfter sell - USDT Balance:", usdtBalanceAfter);
        console.log("After sell - BTC Balance:", btcBalanceAfter);
        
        assertEq(btcBalanceAfter, btcAmount - sellAmount, "BTC balance should be reduced");
        assertEq(
            usdtBalanceAfter, 
            10000 * 1e18 - (btcAmount * btcPrice) + (sellAmount * sellPrice), 
            "USDT balance should be increased"
        );
        vm.stopPrank();
    }

    function test_RevertOnInsufficientUSDT() public {
        vm.startPrank(user1);
        game.registerUser();
        
        uint256 btcAmount = 1 * 1e18;
        uint256 btcPrice = 15000 * 1e18; // Price that exceeds user's USDT balance

        vm.expectRevert(TradingGame.InsufficientUSDTBalance.selector);
        game.executeTrade("BTC", "BUY", btcAmount, btcPrice);
        vm.stopPrank();
    }

    function test_RevertOnInsufficientCrypto() public {
        vm.startPrank(user1);
        game.registerUser();
        
        vm.expectRevert(TradingGame.InsufficientCryptoBalance.selector);
        game.executeTrade("BTC", "SELL", 1 * 1e18, 50000 * 1e18);
        vm.stopPrank();
    }

    function test_RevertOnInvalidTradeType() public {
        vm.startPrank(user1);
        game.registerUser();
        
        vm.expectRevert(TradingGame.InvalidTradeType.selector);
        game.executeTrade("BTC", "INVALID", 1 * 1e18, 50000 * 1e18);
        vm.stopPrank();
    }

    function test_RevertOnUnregisteredUser() public {
        vm.startPrank(user1);
        vm.expectRevert(TradingGame.UserNotRegistered.selector);
        game.executeTrade("BTC", "BUY", 1 * 1e18, 50000 * 1e18);
        vm.stopPrank();
    }

    function test_GetUserPortfolio() public {
        vm.startPrank(user1);
        game.registerUser();
        
        (uint256 usdtBalance, uint256 btcBalance) = game.getUserPortfolio(user1, "BTC");
        assertEq(usdtBalance, 10000 * 1e18, "Initial USDT balance should be correct");
        assertEq(btcBalance, 0, "Initial BTC balance should be 0");
        vm.stopPrank();
    }

    function test_RevertGetPortfolioUnregisteredUser() public {
        vm.expectRevert(TradingGame.UserNotRegistered.selector);
        game.getUserPortfolio(user1, "BTC");
    }
}
