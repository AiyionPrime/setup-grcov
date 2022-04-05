export const grcovRepo = {
    owner: "mozilla",
    repo: "grcov"
}

const artifactAlias = {
    "linux-x64": "x86_64-unknown-linux-gnu",
    "linux-arm64": "aarch64-unknown-linux-gnu",
    "windows-x64": "x86_64-pc-windows-msvc",
    "windows-arm64": "aarch64-pc-windows-msvc",
    "darwin-x64": "x86_64-apple-darwin",
    "darwin-arm64": "aarch64-apple-darwin"
}

export function getArtifactAlias() {
    return artifactAlias[`${os.platform()}-${os.arch()}`]
}

export const platformAssets = {
    'linux': "grcov-linux-x86_64.tar.bz2",
    'darwin': 'grcov-osx-x86_64.tar.bz2'
}