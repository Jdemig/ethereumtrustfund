import { expect } from "chai";
import hre from "hardhat";


function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("TrustFund Tests", () => {
    async function setup() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const TrustFund = await hre.ethers.getContractFactory("TrustFund");
        const trustFund = await TrustFund.deploy();

        return { trustFund, owner, otherAccount };
    }

    it("Should deposit funds and get amount equal to the same as deposited", async () => {
        const { trustFund, owner } = await setup();

        const timestamp = Math.round((new Date()).getTime() / 1000 + 10); // add 60 seconds

        const txn = await trustFund.depositFunds(owner, timestamp, {
           value: hre.ethers.parseUnits("0.01", "ether"),
        });

        const receipt = await txn.wait();

        const unformattedDeposits = await trustFund.getMyDeposits();

        const deposits = Object.values(unformattedDeposits);

        const etherAmount = hre.ethers.formatEther(deposits[0][3]);

        expect(etherAmount).to.equal("0.01");
    });


    it("Should deposit funds and withdraw funds", async () => {
        const { trustFund, owner } = await setup();

        const timestamp = Math.round((new Date()).getTime() / 1000 + 5);

        const txn = await trustFund.depositFunds(owner, timestamp, {
            value: hre.ethers.parseUnits("0.01", "ether")
        });

        const receipt = await txn.wait();

        await timeout(5000);

        const unformattedDeposits = await trustFund.getMyDeposits();

        const deposits = Object.values(unformattedDeposits);

        const firstDepositId = deposits[0][0];

        const fundsTxn = await trustFund.withdrawFunds(firstDepositId);

        const fundReceipts = await fundsTxn.wait();

        expect(fundReceipts?.status).to.equal(1);
    });
});
