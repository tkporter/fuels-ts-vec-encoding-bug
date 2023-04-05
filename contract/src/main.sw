contract;

abi MyContract {
    // Returns the length of the vec, and the first 3 elements.
    // When the vec is the only input, it seems to work as expected
    fn vec_as_only_param(input: Vec<u64>) -> (u64, Option<u64>, Option<u64>, Option<u64>);

    // Returns the length of the vec, and the first 3 elements.
    // When there is another param, the elements aren't what's expected!
    fn u32_and_vec_params(foo: u32, input: Vec<u64>) -> (u64, Option<u64>, Option<u64>, Option<u64>);
}

impl MyContract for Contract {
    fn vec_as_only_param(input: Vec<u64>) -> (u64, Option<u64>, Option<u64>, Option<u64>) {
        (
            input.len(),
            input.get(0),
            input.get(1),
            input.get(2),
        )
    }

    fn u32_and_vec_params(foo: u32, input: Vec<u64>) -> (u64, Option<u64>, Option<u64>, Option<u64>) {
        (
            input.len(),
            input.get(0),
            input.get(1),
            input.get(2),
        )
    }
}
