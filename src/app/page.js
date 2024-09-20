// "use client";
// import Image from "next/image";

// import NearLogo from "/public/near.svg";
// import NextLogo from "/public/next.svg";
// import styles from "./app.module.css";
// import { NearContext } from "@/context";
// import { Cards } from "@/components/cards";
// import { useContext } from "react";
// import { generateAddress } from "@/components/kdf";
// // import ethereum from "@/components/ethereum";
// import { getGasPrice } from "@/utils/getGasPrice";
// import { getBalance } from "@/utils/getBalance";
// import { completeTransaction } from "@/utils/completeTransaction";
// import { getProvider } from "@/utils/getProvider";
// import { ethers } from "ethers";
// import BN from "bn.js";

// export default function Home() {
//   const { signedAccountId, wallet } = useContext(NearContext);
//   console.log(signedAccountId);
//   const genAddress = (chain) => {
//     let accountId = signedAccountId;
//     return generateAddress({
//       publicKey:
//         "secp256k1:54hU5wcCmVUPFWLDALXMh1fFToZsVXrx9BbTbHzSfQq1Kd1rJZi52iPa4QQxo6s5TgjWqgpY8HamYuUDzG6fAaUq",
//       accountId,
//       path: "ethereum-1",
//       chain,
//     });
//   };

//   const getAddress = async () => {
//     const { address } = await genAddress("ethereum");
//     console.log(address);
//     return address;
//   };

//   const address = getAddress();

//   const sendTransaction = async () => {
//     const gasLimit = 21000;
//     const chainId = 545;
//     const currency = "FLOW";
//     const amount = "0.001";
//     const to = "0x525521d79134822a342d330bd91DA67976569aF1";

//     if (!address) return console.log("must provide a sending address");

//     const balance = await getBalance(address);
//     // console.log("balance", ethers.utils.formatUnits(balance), currency);
//     const provider = getProvider();
//     // get the nonce for the sender
//     const nonce = await provider.getTransactionCount(address);
//     const gasPrice = await getGasPrice();

//     const value = ethers.utils.hexlify(ethers.utils.parseUnits(amount));
//     if (value === "0x00") {
//       console.log("Amount is zero. Please try a non-zero amount.");
//     }

//     // check account has enough balance to cover value + gas spend
//     if (
//       !balance ||
//       new BN(balance.toString()).lt(
//         new BN(ethers.utils.parseUnits(amount).toString()).add(
//           new BN(gasPrice).mul(new BN(gasLimit.toString()))
//         )
//       )
//     ) {
//       return console.log("insufficient funds in address", address);
//     }

//     console.log("sending", amount, currency, "from", address, "to", to);

//     const baseTx = {
//       to,
//       nonce,
//       data: [],
//       value,
//       gasLimit,
//       gasPrice,
//       chainId,
//     };

//     await completeTransaction(address, baseTx, chainId, wallet);
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>Hello</div>
//       <div className="">
//         <h1 className="w-100">Welcome to NEAR</h1>
//         <h2>Your NEAR account: {signedAccountId}</h2>
//         {/* <h2>Your Ethereum address: {address}</h2> */}
//         <button
//           onClick={async () => {
//             console.log("first");
//             await sendTransaction();
//             setTimeout(10000000);
//             console.log("Comleted");
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </main>
//   );
// }

"use client";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import BN from "bn.js";

import { NearContext } from "@/context";
import { generateAddress } from "@/components/kdf";
import { getGasPrice } from "@/utils/getGasPrice";
import { getBalance } from "@/utils/getBalance";
import { completeTransaction } from "@/utils/completeTransaction";
import { getProvider } from "@/utils/getProvider";
import styles from "./app.module.css";
import ethereum from "@/components/ethereum";
import { createSign } from "@/utils/createSign";
import { complete } from "@/utils/complete";

export default function Home() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [address, setAddress] = useState("");
  // const [sign, setSign] = useState(null);

  // Fetch Ethereum address when component mounts
  useEffect(() => {
    const fetchAddress = async () => {
      const { address: ethAddress } = await generateAddress({
        publicKey:
          "secp256k1:54hU5wcCmVUPFWLDALXMh1fFToZsVXrx9BbTbHzSfQq1Kd1rJZi52iPa4QQxo6s5TgjWqgpY8HamYuUDzG6fAaUq",
        accountId: signedAccountId,
        path: "ethereum-1",
        chain: "ethereum",
      });
      setAddress(ethAddress);
    };
    fetchAddress();
  }, [signedAccountId]);

  const sendTransaction = async () => {
    const gasLimit = 21000;
    const chainId = 545;
    const currency = "FLOW";
    const amount = "0.001";
    const to = "0x525521d79134822a342d330bd91DA67976569aF1";

    if (!address) {
      console.log("must provide a sending address");
      return;
    }

    const balance = await getBalance(address);
    const provider = getProvider();
    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await getGasPrice();

    const value = ethers.utils.hexlify(ethers.utils.parseUnits(amount));
    if (value === "0x00") {
      console.log("Amount is zero. Please try a non-zero amount.");
      return;
    }

    if (
      !balance ||
      new BN(balance.toString()).lt(
        new BN(ethers.utils.parseUnits(amount).toString()).add(
          new BN(gasPrice).mul(new BN(gasLimit.toString()))
        )
      )
    ) {
      console.log("insufficient funds in address", address);
      return;
    }

    console.log("sending", amount, currency, "from", address, "to", to);

    const baseTx = {
      to,
      nonce,
      data: [],
      value,
      gasLimit,
      gasPrice,
      chainId,
    };

    await completeTransaction(address, baseTx, chainId, wallet);
    // const sign = await createSign(address, baseTx, chainId, wallet);
    // setSign(sign);
    // sessionStorage.setItem("sign", sign);
  };

  const approveTransaction = async () => {
    const gasLimit = 21000;
    const chainId = 545;
    const currency = "FLOW";
    const amount = "0.001";
    const to = "0x525521d79134822a342d330bd91DA67976569aF1";

    if (!address) {
      console.log("must provide a sending address");
      return;
    }

    const balance = await getBalance(address);
    const provider = getProvider();
    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await getGasPrice();

    const value = ethers.utils.hexlify(ethers.utils.parseUnits(amount));
    if (value === "0x00") {
      console.log("Amount is zero. Please try a non-zero amount.");
      return;
    }

    if (
      !balance ||
      new BN(balance.toString()).lt(
        new BN(ethers.utils.parseUnits(amount).toString()).add(
          new BN(gasPrice).mul(new BN(gasLimit.toString()))
        )
      )
    ) {
      console.log("insufficient funds in address", address);
      return;
    }

    console.log("sending", amount, currency, "from", address, "to", to);

    const baseTx = {
      to,
      nonce,
      data: [],
      value,
      gasLimit,
      gasPrice,
      chainId,
    };

    // await completeTransaction(address, baseTx, chainId, wallet);
    const sign = sessionStorage.getItem("sign");
    // await complete(baseTx, sign, address);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>Hello</div>
      <div>
        <h1 className="w-100">Welcome to NEAR</h1>
        <h2>Your NEAR account: {signedAccountId}</h2>
        <h2>Your Ethereum address: {address || "Fetching..."}</h2>
        <button
          onClick={async () => {
            console.log("Sending transaction...");
            await sendTransaction();
            // await ethereum.send({
            //   from: address,
            //   to: "0x525521d79134822a342d330bd91DA67976569aF1",
            //   amount: "0.01",
            //   wallet,
            // });
            // await ethereum.completeEthereumTx({
            //   address: address,
            //   to: "0x525521d79134822a342d330bd91DA67976569aF1",
            //   amount: "0.01",
            //   wallet: wallet,
            // });
            console.log("Transaction completed");
          }}
        >
          Send
        </button>
        <button
          onClick={async () => {
            console.log(sign);
            await approveTransaction();
            console.log("Transaction completed");
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
