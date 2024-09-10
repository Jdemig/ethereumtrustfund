import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


import { accounts, hardhatAccounts } from "./test-wallets";


console.log(accounts);



const GWEI = 1000 * 1000 * 1000;

const DEFAULT_BLOCK_GAS_LIMIT = 9500000;
const DEFAULT_GAS_MUL = 5;
const BUIDLEREVM_CHAINID = 31337;


const config: HardhatUserConfig = {
  solidity: "0.8.24",
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
    amoy: {
      url: "https://polygon-amoy.infura.io/v3/cafc0be7c6eb43bd963c7ec73869de42",
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gasMultiplier: DEFAULT_GAS_MUL,
      gasPrice: 120 * GWEI,
      chainId: 80002,
      accounts: accounts.map(({ secretKey }: { secretKey: string; balance: string }) => secretKey), 
    },
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/222b984993d348afa14095524667a32a",
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gasMultiplier: DEFAULT_GAS_MUL,
      gasPrice: 120 * GWEI,
      chainId: 137,
      accounts: accounts.map(({ secretKey }: { secretKey: string; balance: string }) => secretKey), 
    },
  },
};

export default config;
