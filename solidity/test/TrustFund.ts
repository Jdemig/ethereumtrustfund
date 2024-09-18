import { expect } from "chai";
import hre from "hardhat";


function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("TrustFund Tests", function () {

  async function setup() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const TrustFund = await hre.ethers.getContractFactory("TrustFund");
    const trustFund = await TrustFund.deploy();
    
    return { trustFund, owner, otherAccount };
  }

  it("Should deposit funds and get amount equal to the same as deposited", async () => {
    const { trustFund, owner } = await setup();

    const timestamp = Math.round((new Date()).getTime() / 1000 + 10);

    const txn = await trustFund.depositFunds(owner, timestamp, {
      value: hre.ethers.parseUnits("0.01", "ether"),
    });

    const receipt = await txn.wait();

    const amount = await trustFund.getFundsAmount();

    const etherAmount = hre.ethers.formatEther(amount);

    expect(etherAmount).to.equal("0.01");
  });

  it("Should deposit funds and withdraw funds", async () => {
    const { trustFund, owner } = await setup();

    const timestamp = Math.round((new Date()).getTime() / 1000 + 10);

    const txn = await trustFund.depositFunds(owner, timestamp, {
        value: hre.ethers.parseUnits("0.01", "ether")
    });

    const receipt = await txn.wait();

    await timeout(10000);

    const fundsTxn = await trustFund.withdrawFunds();

    const fundReceipts = await fundsTxn.wait();

    expect(fundReceipts?.status).to.equal(1);
  });

  it("Should deposit multiple funds and withdraw funds", async () => {
    const { trustFund, owner } = await setup();

    const timestamp = Math.round((new Date()).getTime() / 1000 + 10);

    const txn = await trustFund.depositFunds(owner, timestamp, {
      value: hre.ethers.parseUnits("0.01", "ether")
    });

    const receipt = await txn.wait();

    const txn2 = await trustFund.depositFunds(owner, timestamp, {
      value: hre.ethers.parseUnits("0.01", "ether")
    });

    const receipt2 = await txn.wait();

    await timeout(10000);

    const amount = await trustFund.getFundsAmount();

    const etherAmount = hre.ethers.formatEther(amount);

    expect(etherAmount).to.equal("0.02");

    const fundsTxn = await trustFund.withdrawFunds();

    const fundReceipts = await fundsTxn.wait();

    expect(fundReceipts?.status).to.equal(1);
  });
});
