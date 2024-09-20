import { ethers } from "ethers";

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    // "https://ethereum-sepolia.publicnode.com"
    // "https://sepolia.base.org"
    "https://testnet.evm.nodes.onflow.org"
  );
};
