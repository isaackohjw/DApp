import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OrganizationFactoryModule = buildModule("OrganizationFactory", (m) => {
  const organizationFactory = m.contract("OrganizationFactory", [], {});

  return { organizationFactory };
});

export default OrganizationFactoryModule;
