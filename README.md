# Vec encoding bug

When a Vec<_> is the first parameter of a function in the Sway contract, fuels-ts encodes
this properly. However, it seems like when the Vec isn't the first parameter to the function,
the Vec is encoded incorrectly. This contains a repro of the issue.

To illustrate, there are 2 functions found in `contract/src/main.sw`:

```
    // Returns the length of the vec, and the first 3 elements.
    // When the vec is the only input, it seems to work as expected
    fn vec_as_only_param(input: Vec<u64>) -> (u64, Option<u64>, Option<u64>, Option<u64>) {
        (
            input.len(),
            input.get(0),
            input.get(1),
            input.get(2),
        )
    }

    // Returns the length of the vec, and the first 3 elements.
    // When there is another param, the elements aren't what's expected!
    fn u32_and_vec_params(foo: u32, input: Vec<u64>) -> (u64, Option<u64>, Option<u64>, Option<u64>) {
        (
            input.len(),
            input.get(0),
            input.get(1),
            input.get(2),
        )
    }
```

Then in `src/test.ts`, fuels-ts is used to call both these functions with the same input vec, `[1, 2, 3]`.

When `vec_as_only_param` is called, the expected values are returned-- a length of 3, the first element as 1, the second as 2, the third as 3.

However when `u32_and_vec_params` is called, the values returned are not what's expected. The length of 3 is interestingly correct, but some very large elements are returned.

## Running this

You just need `forc` and `fuel-core` installed to repro.

First, install dependencies:
```
yarn
```

In a separate terminal, run this to start a local Fuel node that the test contract will be deployed to (requires fuel-core in your PATH):
```
yarn local-node
```

Then while the local node is still running in another terminal, run this to build the contracts & generate TS types:
```
yarn build
```

And finally, to run the repro script:
```
yarn test
```

You'll see an output like this:

```
Deploying contract...
Contract ID:
{
  contract: '0x6570d32e7b362ffa6224071fb7ea0a2f5429b3d574441e9b3f19f38f4550147c'
}
The vec input passed in: [ 1, 2, 3 ]
When calling `vec_as_only_param`:
Input len: 3
Element 0: <BN: 0x1>
Element 1: <BN: 0x2>
Element 2: <BN: 0x3>
When calling `u32_and_vec_params`:
Input len: 3
Element 0: <BN: 0x719bbe7ef8cf1bc4>
Element 1: <BN: 0xd3b45d9058ac045e>
Element 2: <BN: 0xcdefe2fc9e9bd6bd>
```

As you can see, `vec_as_only_param` has the expected return values, but `u32_and_vec_params` has some bogus elements

### Versions I'm using

I'm running with a fresh `fuelup update`, giving these versions:

```
$ fuelup show
Default host: aarch64-apple-darwin
fuelup home: /Users/trevor/.fuelup

installed toolchains
--------------------
latest-aarch64-apple-darwin (default)
hyperlane

active toolchain
-----------------
latest-aarch64-apple-darwin (default)
  forc : 0.35.5
    - forc-client
      - forc-deploy : 0.35.5
      - forc-run : 0.35.5
    - forc-doc : 0.35.5
    - forc-explore : 0.28.1
    - forc-fmt : 0.35.5
    - forc-index : 0.6.1
    - forc-lsp : 0.35.5
    - forc-wallet : 0.2.1
  fuel-core : 0.17.3
  fuel-indexer : 0.6.1
```
And node 16:
```
$ node --version
v16.19.1
```