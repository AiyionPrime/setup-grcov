const os = require('os')
export const grcovRepo = {
    owner: "mozilla",
    repo: "grcov"
}

const artifactAlias = {
    "linux-x64": "grcov-x86_64-unknown-linux-gnu.tar.bz2",
    "linux-arm64": "grcov-aarch64-unknown-linux-gnu.tar.bz2",
    "windows-x64": "grcov-x86_64-pc-windows-msvc.zip",
    "windows-arm64": "grcov-aarch64-pc-windows-msvc.zip",
    "darwin-x64": "grcov-x86_64-apple-darwin.tar.bz2",
    "darwin-arm64": "grcov-aarch64-apple-darwin.tar.bz2"
}

export function getArtifactAlias() {
    return artifactAlias[`${os.platform()}-${os.arch()}`]
}