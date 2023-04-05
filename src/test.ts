import { readFileSync } from 'fs';
import {
  Contract,
  ContractFactory,
  ContractUtils,
  Provider,
  Wallet,
  WalletUnlocked,
} from 'fuels';

import { ContractAbi__factory } from '../types/factories/ContractAbi__factory';

// First default account from running fuel-client locally:
//   Address: 0x6b63804cfbf9856e68e5b6e7aef238dc8311ec55bec04df774003a2c96e0418e
//   Balance: 10000000
const PRIVATE_KEY =
  '0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c';

// Rather than generating a new random contract ID each time, we can use a consistent salt
// to have a deterministic ID as long as the bytecode of the contract stays the same.
// See here to understand how contract IDs are generated:
// https://fuellabs.github.io/fuel-specs/master/protocol/id/contract.html
const CONTRACT_SALT =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

// Deploys the contract if it's not been deployed already, and calls `test_function`
async function main() {
  const provider = new Provider('http://127.0.0.1:4000/graphql');
  const wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);

  const contract = await deployOrGetContract(wallet);

  console.log('Contract ID:');
  console.log({
    contract: contract.id.toHexString(),
  });

  await makeTestCalls(contract);
}

async function deployOrGetContract(wallet: WalletUnlocked): Promise<Contract> {
  const bytecode = readFileSync(
    './contract/out/debug/contract.bin',
  );

  const factory = new ContractFactory(
    bytecode,
    ContractAbi__factory.abi,
    wallet,
  );

  const expectedContractId = ContractUtils.getContractId(
    bytecode,
    CONTRACT_SALT,
    ContractUtils.getContractStorageRoot([]),
  );

  const maybeDeployedContract = await wallet.provider.getContract(
    expectedContractId,
  );

  // If the contract's already been deployed, just get the existing one without deploying
  if (maybeDeployedContract) {
    console.log('Contract already deployed');
    return new Contract(
      expectedContractId,
      ContractAbi__factory.abi,
      wallet,
    );
  }

  console.log('Deploying contract...');
  return factory.deployContract({
    salt: CONTRACT_SALT,
  });
}

async function makeTestCalls(contract: Contract) {
  const vec = [1, 2, 3];
  // Logging as hex just to make it easier to read
  console.log('The vec input passed in:', vec);

  let [vecLen, element0, element1, element2] = (await contract.functions.vec_as_only_param(
    vec,
  ).call()).value;

  console.log('When calling `vec_as_only_param`:');
  console.log('Input len:', vecLen.toString());
  console.log('Element 0:', element0);
  console.log('Element 1:', element1);
  console.log('Element 2:', element2);

  [vecLen, element0, element1, element2] = (await contract.functions.u32_and_vec_params(
    69,
    vec,
  ).call()).value;

  console.log('When calling `u32_and_vec_params`:');
  console.log('Input len:', vecLen.toString());
  console.log('Element 0:', element0);
  console.log('Element 1:', element1);
  console.log('Element 2:', element2);
}

main().catch((err) => console.error('Error:', err));
