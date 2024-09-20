import { ethers } from "ethers";

export const encodeData = ({ method, args, ret }) => {
  const abi = [
    `function ${method}(${Object.keys(args).join(",")}) returns (${ret.join(
      ","
    )})`,
  ];
  const iface = new ethers.utils.Interface(abi);
  const allArgs = [];
  const argValues = Object.values(args);
  for (let i = 0; i < argValues.length; i++) {
    allArgs.push(argValues[i]);
  }

  console.log(abi[0], "with args", allArgs);

  return {
    iface,
    data: iface.encodeFunctionData(method, allArgs),
  };
};
