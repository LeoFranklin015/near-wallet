import { getBalance } from "./getBalance";
import { getGasPrice } from "./getGasPrice";
import { getProvider } from "./getProvider";
import { ethers } from "ethers";
import { Wallet } from "@/wallets/near";
import BN from "bn.js";
export const complete = async (baseTx: any, sig: any, address: string) => {
  const explorer = "https://evm-testnet.flowscan.io";
  const currency = "FLOW";

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
