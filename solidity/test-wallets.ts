import 'dotenv/config'

const balance = "1000000000000000000000000";

// Accounts
// ========

// Account #0: 0xc783df8a850f42e7F7e57013759C285caa701eB6 (1000000 ETH)

// Account #1: 0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4 (1000000 ETH)

// Account #2: 0x2fFd013AaA7B5a7DA93336C2251075202b33FB2B (1000000 ETH)

// Account #3: 0x9FC9C2DfBA3b6cF204C37a5F690619772b926e39 (1000000 ETH)

// Account #4: 0xaD9fbD38281F615e7DF3DeF2Aad18935a9e0fFeE (1000000 ETH)

// Account #5: 0x8BffC896D42F07776561A5814D6E4240950d6D3a (1000000 ETH)

// Account #6: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec (1000000 ETH)

// Account #7: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (1000000 ETH)


export const hardhatAccounts = [
    {
        secretKey: "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122",
        balance,
    },
    {
        secretKey: "0xd49743deccbccc5dc7baa8e69e5be03298da8688a15dd202e20f15d5e0e9a9fb",
        balance,
    },
    {
        secretKey: "0x87630b2d1de0fbd5044eb6891b3d9d98c34c8d310c852f98550ba774480e47cc",
        balance,
    },
    {
        secretKey: "0x275cc4a2bfd4f612625204a20a2280ab53a6da2d14860c47a9f5affe58ad86d4",
        balance,
    },
    {
        secretKey: "0xaee25d55ce586148a853ca83fdfacaf7bc42d5762c6e7187e6f8e822d8e6a650",
        balance,
    },
    {
        secretKey: "0xa2e0097c961c67ec197b6865d7ecea6caffc68ebeb00e6050368c8f67fc9c588",
        balance,
    },
    {
        secretKey: "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
        balance,
    },
];

export const accounts = [
    {
        secretKey: process.env.ACCOUNT_SECRET_KEY_1 || '',
        balance,
    },
];