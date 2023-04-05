/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.38.0
  Forc version: 0.35.5
  Fuel-Core version: 0.17.3
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

import type { Option, Vec } from "./common";

interface ContractAbiInterface extends Interface {
  functions: {
    u32_and_vec_params: FunctionFragment;
    vec_as_only_param: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'u32_and_vec_params', values: [BigNumberish, Vec<BigNumberish>]): Uint8Array;
  encodeFunctionData(functionFragment: 'vec_as_only_param', values: [Vec<BigNumberish>]): Uint8Array;

  decodeFunctionData(functionFragment: 'u32_and_vec_params', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'vec_as_only_param', data: BytesLike): DecodedValue;
}

export class ContractAbi extends Contract {
  interface: ContractAbiInterface;
  functions: {
    u32_and_vec_params: InvokeFunction<[foo: BigNumberish, input: Vec<BigNumberish>], [BN, Option<BN>, Option<BN>, Option<BN>]>;
    vec_as_only_param: InvokeFunction<[input: Vec<BigNumberish>], [BN, Option<BN>, Option<BN>, Option<BN>]>;
  };
}