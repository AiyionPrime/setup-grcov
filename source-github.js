const os = require('os')
const core = require('@actions/core')
const github = require('@actions/github')
const toolcache = require('@actions/tool-cache')
const config = require('./config')

/**
 * Determines whether the current platform supports this source.
 * @returns { boolean }
 */
export function supported() {
    return !!config.platformAssets[os.platform()] && (core.getInput("use-cargo") || "false") == "false"
}

/**
 * Installs and returns the path to the newly installed grcov binary
 * @param { string | "latest" } version The version to install 
 * @returns { string }
 */
export async function getVersion(version) {
    const githubToken = core.getInput("github-token", { required: true })
    const octokit = github.getOctokit(githubToken)
    
    const assetName = config.platformAssets[os.platform()]
    if (!assetName) {
        throw new Error(`mozilla/grcov does not support ${os.platform()}`)
    }

    core.debug(`Fetching release information for mozilla/grcov@${version}`)
    const release = await octokit.repos.getReleaseByTag({
        ...config.grcovRepo,
        tag: `v${version}`
    })

    if (!release) {
        throw new Error(`Could not find a release for mozilla/grcov@${version}`)
    }
    
    core.debug(`Fetching assets for mozilla/grcov@${version}`)
    const assets = await octokit.repos.listReleaseAssets({
        ...config.grcovRepo,
        release_id: release.data.id
    })

    const asset = assets.data.find(a => a.name === assetName)
    if (!asset) {
        throw new Error(`mozilla/grcov@${version} has not published the ${assetName} asset`)
    }

    core.info(`Installing mozilla/grcov@${version}`)
    const assetArchive = await toolcache.downloadTool(asset.browser_download_url, assetName, `Token ${githubToken}`)
    const assetExtracted = await toolcache.extractTar(assetArchive, '.installed/grcov', '-xv')

    return `${assetExtracted}/grcov`
}