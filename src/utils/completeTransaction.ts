import { getBalance } from "./getBalance";
import { getGasPrice } from "./getGasPrice";
import { getProvider } from "./getProvider";
import { ethers } from "ethers";
import { Wallet } from "@/wallets/near";
import BN from "bn.js";

export const completeTransaction = async (
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
  // console.log(signature);
  // const successValue = (signature.status as any).SuccessValue;
  // const decodedValue = Buffer.from(successValue, "base64").toString("utf-8");

  const sig = {
    r: big_r.affine_point.slice(2),
    s: s.scalar,
    v: 0,
  };

  //   if (!sig) return;
  console.log(sig);
  sig.r = "0x" + sig.r;
  sig.s = "0x" + sig.s;
  // console.log('sig', sig);

  // check 2 values for v (y-parity) and recover the same ethereum address from the generateAddress call (in app.ts)
  console.log("address", address);
  let addressRecovered = false;
  for (let v = 0; v < 2; v++) {
    sig.v = v + chainId * 2 + 35;
    const recoveredAddress = ethers.utils.recoverAddress(payload, sig);

    console.log("recoveredAddress", recoveredAddress);
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      addressRecovered = true;
      break;
    }
  }
  //   if (!addressRecovered) {
  //     return console.log("signature failed to recover correct sending address");
  //   }

  // broadcast TX - signature now has correct { r, s, v }
  try {
    const hash = await getProvider().send("eth_sendRawTransaction", [
      ethers.utils.serializeTransaction(baseTx, sig),
    ]);
    console.log("tx hash", hash);
    console.log("explorer link", `${explorer}/tx/${hash}`);
    console.log("fetching updated balance in 60s...");
    setTimeout(async () => {
      const balance = await getBalance(address);
      console.log("balance", ethers.utils.formatUnits(balance), currency);
    }, 60000);
  } catch (e) {
    if (/nonce too low/gi.test(JSON.stringify(e))) {
      return console.log("tx has been tried");
    }
    if (/gas too low|underpriced/gi.test(JSON.stringify(e))) {
      return console.log(e);
    }
    console.log(e);
  }
};
