import { fetchJson } from "ethers/lib/utils";
export const getGasPrice = async () => {
  const {
    data: { rapid, fast, standard },
  } = await fetchJson(`https://sepolia.beaconcha.in/api/v1/execution/gasnow`);
  let gasPrice = Math.max(rapid, fast, standard);
  if (!gasPrice) {
    console.log("Unable to get gas price. Please refresh and try again.");
  }
  return Math.max(rapid, fast, standard);
};
