const core = require('@actions/core')
const github = require('@actions/github')
const config = require('./config')

export default async function resolveVersion(version) {
    if (version !== "latest") {
        return version
    }

    const githubToken = core.getInput("github-token", { required: true })
    const octokit = github.getOctokit(githubToken)

    
    core.debug("Fetching releases for mozilla/grcov")
    const releases = await octokit.repos.listReleases(config.grcovRepo)

    core.debug("Found the following mozilla/grcov releases")
    releases.data.forEach(r => core.debug(`  - ${r.tag_name}`))

    const release = releases.data.find(r => version === 'latest' || r.tag_name === `v${version}`)

    if (!release) {
        throw new Error(`Could not find a release matching '${version}'.`)
    }

    return release.tag_name.replace(/^v/, '')
}