# `setup-grcov` Action
This GitHub action sets up [mozilla/grcov][] in your current environment.

It downloads the latest official releases directly from the [mozilla/grcov] release
page, greatly reducing the time taken to install `grcov` when compared to installing
with `cargo install grcov`.

## Example Workflow

```yaml
on: [push]

name: CI

jobs:
  test-rust:
    name: Test with Coverage
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: nightly
          components: llvm-tools-preview
      - uses: SierraSoftworks/setup-grcov@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          version: latest
      - run: cargo test
        env:
          RUSTFLAGS: "-Zinstrument-coverage"
      - run: grcov . --binary-path target/debug/deps/ -s . -t lcov --ignore-not-existing --ignore '../**' --ignore '/*' -o ./lcov.info
      - uses: codecov/codecov-action@v1
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./lcov.info

```

## Inputs

| Name           | Required | Description                                            | Type   | Default |
| -------------- | :------: | ------------------------------------------------------ | ------ | ------- |
| `github-token` | ✓        | `${{ secrets.GITHUB_TOKEN }}` to access the GitHub API | string |         |
| `version`      |          | The version of `grcov` to install                      | string | latest  |
| `use-cargo`    |          | Always use cargo to install `grcov`                    | bool   | `false` |

**NOTE**: When installing `grcov` on platforms which don't have prebuilt binary releases, you should
ensure that `cargo` is present on your `$PATH` by using something like [actions-rs/toolchain].

## License
This Action is distributed under the terms of the MIT license, see [LICENSE](./LICENSE) for details.

[actions-rs/toolchain]: https://github.com/actions-rs/toolchain
[mozilla/grcov]: https://github.com/mozilla/grcov