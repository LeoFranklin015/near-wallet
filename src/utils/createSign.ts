import { ethers } from "ethers";
import { Wallet } from "@/wallets/near";
import BN from "bn.js";
export const createSign = async (
  address: string,
  baseTx: any,
  chainId: any,
  wallet: Wallet
) => {
  const explorer = "https://evm-testnet.flowscan.io";
  const currency = "FLOW";

  const unsignedTx = ethers.utils.serializeTransaction(baseTx);
  const txHash = ethers.utils.keccak256(unsignedTx);
  const payload = Object.values(ethers.utils.arrayify(txHash));
  let attachedDeposit = "1";

  let args = {
    payload,
    path: "ethereum-1",
    key_version: 0,
    rlp_payload: undefined,
    request: undefined,
  };

  const arg = {
    request: args,
  };

  // get signature from MPC contract
  const { big_r, s, recovery_id } = await wallet.callMethod({
    contractId: "v1.signer-dev.testnet",
    method: "sign",
    args: arg,
    gas: new BN("300000000000000").toString(),
    deposit: attachedDeposit,
  });

  return { big_r, s, recovery_id };
};
