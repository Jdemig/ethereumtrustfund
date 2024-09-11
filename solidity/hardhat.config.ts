import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'

import { accounts, hardhatAccounts } from "./test-wallets";


const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const AMOY_RPC_PROVIDER = process.env.AMOY_RPC_PROVIDER || '';
const POLYGON_RPC_PROVIDER = process.env.POLYGON_RPC_PROVIDER || '';

const GWEI = 1000 * 1000 * 1000;

const DEFAULT_BLOCK_GAS_LIMIT = 9500000;
const DEFAULT_GAS_MUL = 5;
const BUIDLEREVM_CHAINID = 31337;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        },
      }
    ]
  },
  networks: {
    hardhat: {
        blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
        gas: DEFAULT_BLOCK_GAS_LIMIT,
        chainId: BUIDLEREVM_CHAINID,
        throwOnTransactionFailures: true,
        throwOnCallFailures: true,
        accounts: hardhatAccounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
            privateKey: secretKey,
            balance,
        })),
    },
    localhost: {
        //chainId: process.env.FORK ? 41337 : 31337,
        blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
        gas: DEFAULT_BLOCK_GAS_LIMIT,
        gasPrice: 80000000000,
        throwOnTransactionFailures: true,
        throwOnCallFailures: true,
        accounts: accounts.map(({ secretKey }: { secretKey: string; balance: string }) => secretKey),
    },
    polygonAmoy: {
      url: AMOY_RPC_PROVIDER,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gasMultiplier: DEFAULT_GAS_MUL,
      gasPrice: 120 * GWEI,
      chainId: 80002,
      accounts: accounts.map(({ secretKey }: { secretKey: string; balance: string }) => secretKey), 
    },
    polygon: {
      url: POLYGON_RPC_PROVIDER,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gasMultiplier: DEFAULT_GAS_MUL,
      gasPrice: 120 * GWEI,
      chainId: 137,
      accounts: accounts.map(({ secretKey }: { secretKey: string; balance: string }) => secretKey), 
    },
  },
};

export default config;
