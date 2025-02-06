# Include .env file
-include .env

# Default network and account
network ?= holesky
account ?= myaccounttest

# Command templates with account selection
ifeq ($(account),myaccounttest)
else ifeq ($(account),myaccount)
else
    $(error Unknown account: $(account))
endif

FORGE_RPC := forge script script/DeployTradingGame.s.sol --rpc-url $(RPC_URL)
FORGE_VERIFY := --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
FORGE_ACCOUNT := --account $(account)

.PHONY: all test clean deploy-holesky deploy-local anvil help

# Default target
all: clean install build

# Install dependencies
install:
	forge install

# Build the project
build:
	forge build

# Clean the build artifacts
clean:
	forge clean

# Run tests
test:
	forge test

# Run tests with gas report
test-gas:
	forge test --gas-report

# Run tests with verbosity
test-v:
	forge test -vv

# Run coverage report
coverage:
	forge coverage

# Start local node
anvil:
	anvil

# Deploy to local network
deploy-local:
	@echo "Deploying to local network using account: $(account)..."
	forge script script/DeployTradingGame.s.sol --rpc-url http://localhost:8545 --broadcast $(FORGE_ACCOUNT)

# Deploy to Holesky
deploy-holesky:
	@echo "Deploying to Holesky using account: $(account)..."
	$(FORGE_RPC) --broadcast $(FORGE_VERIFY) $(FORGE_ACCOUNT) -vvvv

# Format code
format:
	forge fmt

# Display help information
help:
	@echo "Available targets:"
	@echo "  install         - Install dependencies"
	@echo "  build          - Build the project"
	@echo "  clean          - Remove build artifacts"
	@echo "  test           - Run tests"
	@echo "  test-gas       - Run tests with gas reporting"
	@echo "  test-v         - Run tests with verbose output"
	@echo "  coverage       - Generate coverage report"
	@echo "  anvil          - Start local Anvil node"
	@echo "  deploy-local   - Deploy to local network"
	@echo "  deploy-holesky - Deploy to Holesky testnet"
	@echo "  format         - Format the code"
	@echo ""
	@echo "Options:"
	@echo "  account=<name> - Specify account to use (myaccount or account2)"
