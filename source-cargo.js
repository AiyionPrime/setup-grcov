const core = require('@actions/core')
const exec = require('@actions/exec')
const io = require('@actions/io')


/**
 * Determines whether the current platform is supported or not
 * @returns {boolean}
 */
export function supported() {
    return true
}

/**
 * Installs and returns the path to the new grcov binary
 * @param { string | "latest" } version The version to install 
 * @returns {string}
 */
export async function getVersion(version) {
    const extraArgs = [
        "--version",
        version
    ]

    core.debug(`Running cargo install grcov ${extraArgs.join(' ')}`)
    const exitCode = await exec.exec("cargo", [
        "install",
        "grcov",
        ...extraArgs
    ])

    if (exitCode) {
        throw new Error(`Unable to install grcov with cargo (exit code: ${exitCode}). Make sure that cargo is installed and try again.`)
    }
    
    return await io.which("grcov", true)
}