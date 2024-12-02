import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseUnits } from "viem";

const DummyTokenModule = buildModule("DummyToken", (m) => {
  const token = m.contract(
    "DummyToken",
    ["TEST", "TEST", parseUnits("10000", 18)],
    {}
  );

  return { token };
});

export default DummyTokenModule;
