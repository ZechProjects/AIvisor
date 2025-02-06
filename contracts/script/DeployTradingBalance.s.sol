// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {TradingBalance} from "../src/TradingBalance.sol";

contract DeployTradingBalance is Script {
    function run() public returns (TradingBalance) {
        // Begin recording transactions for deployment
        vm.startBroadcast();

        // Deploy the contract
        TradingBalance tradingBalance = new TradingBalance();

        // Stop recording transactions
        vm.stopBroadcast();

        // Return the deployed contract
        return tradingBalance;
    }
}
