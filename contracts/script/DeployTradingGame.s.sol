// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {TradingGame} from "../src/TradingGame.sol";

contract DeployTradingGame is Script {
    function run() public returns (TradingGame) {
        // Begin recording transactions for deployment
        vm.startBroadcast();

        // Deploy the contract
        TradingGame tradingGame = new TradingGame();

        // Stop recording transactions
        vm.stopBroadcast();

        // Return the deployed contract
        return tradingGame;
    }
}
