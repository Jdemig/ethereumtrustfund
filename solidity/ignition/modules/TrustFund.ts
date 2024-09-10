import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const TrustFundModule = buildModule("TrustFundModule", (m) => {
  const trustFund = m.contract("TrustFund", [], {});

  return { trustFund };
});

export default TrustFundModule;
