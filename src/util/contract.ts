import Web3, { AbiFragment, AbiInput, HexString } from 'web3'
import {Contract, ethers} from 'ethers'

export interface ContractOptions {
  contractAddress: string
  abi: any
}

// export const contractCall = async (options: ContractOptions, rpc: string, method: string, params: any) => {
//   const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
//   const contractInstance = new web3.eth.Contract(options.abi, options.contractAddress);

//   return Array.isArray(params) ? (contractInstance.methods[method] as any)(...params).call() : (contractInstance.methods[method] as any)(params).call()
// }

export const contractCall = async (options: ContractOptions, rpc: string, method: string, params: any) => {
  const provider = new ethers.JsonRpcProvider(rpc)
  const contract = new Contract(options.contractAddress, options.abi, provider)
  return Array.isArray(params) ? contract[method](...params) : contract[method](params)
}

export const encodeTxData = async (options: ContractOptions, method: string, params: any) => {
  const web3 = new Web3();
  const contractInstance = new web3.eth.Contract(options.abi as any, options.contractAddress);

  return (contractInstance.methods[method] as any)(...params).encodeABI()
}

export const decodeTxData = (abi: AbiInput[], bytes: HexString) => {
  const web3 = new Web3();

  return web3.eth.abi.decodeParameters(abi, `0x${bytes.substr(10)}`)
}

export const findABIFragment = (type: string, name: string, abi: AbiFragment[]) => {
  return abi.find((i: any) => i.type === type && i.name === name)
}