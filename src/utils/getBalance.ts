import { getProvider } from "./getProvider";

export const getBalance = async (address: string): Promise<number> => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return parseFloat(balance.toString());
};
