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

const archSuffix = {
    "linux": "-gnu"
}

const arch = `${os.platform()}-${os.arch()}{archSuffix[os.arch()] || ''}`

async function runAction() {
    const version = await resolveVersion(core.getInput("version", { required: false }) || "latest")

    let cachedPath = toolcache.find("mozilla/grcov", version, arch)
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

    cachedPath = await toolcache.cacheFile(installedPath, 'grcov', 'mozilla/grcov', version, arch)
    core.addPath(cachedPath)
    core.info(`Installed mozilla/grcov@${version}`)
}

runAction().then(() => { }).catch(err => core.setFailed(err.message))
