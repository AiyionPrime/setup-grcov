const os = require('os')
const core = require('@actions/core')
const toolcache = require('@actions/tool-cache')

const sourceGithub = require('./source-github')
const sourceCargo = require('./source-cargo')
const { default: resolveVersion } = require('./version')

const sources = [
    sourceGithub,
    sourceCargo
]

const artifactAlias = {
    "linux-x64": "x86_64-unknown-linux-gnu",
    "linux-arm64": "aarch64-unknown-linux-gnu",
    "windows-x64": "x86_64-pc-windows-msvc",
    "windows-arm64": "aarch64-pc-windows-msvc",
    "darwin-x64": "x86_64-apple-darwin",
    "darwin-arm64": "aarch64-apple-darwin"
}

const artifact = artifactAlias[`${os.platform()}-${os.arch()}`]

if (!artifact) {
    throw new Error(`This action does not support your current platform (${os.platform()}) and architecture (${os.arch()}).`)
}

async function runAction() {
    const version = await resolveVersion(core.getInput("version", { required: false }) || "latest")

    let cachedPath = toolcache.find("mozilla/grcov", version, artifact)
    if (cachedPath) {
        core.addPath(cachedPath)
        core.info(`Using cached mozilla/grcov@${version}`)
        return
    }

    const source = sources.find(s => s.supported())
    if (!source) {
        throw new Error(`This action does not support your current platform (${os.platform()})`)
    }

    core.info(`Installing mozilla/grcov@${version}`)
    const installedPath = await source.getVersion(version)

    cachedPath = await toolcache.cacheFile(installedPath, 'grcov', 'mozilla/grcov', version, artifact)
    core.addPath(cachedPath)
    core.info(`Installed mozilla/grcov@${version}`)
}

runAction().then(() => { }).catch(err => core.setFailed(err.message))
