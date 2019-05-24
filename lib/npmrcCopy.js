/**
 * Copy .npmrc file to sub package directories
 * @memberof module:pon-task-subpack
 * @function npmrcCopy
 * @param {string} base - Base package json file path
 * @param {string} sub - Sub packages file pattern
 * @returns {function()} - Pon task
 */
'use strict'

const { copyAsync, statAsync } = require('asfs')
const path = require('path')
const aglob = require('aglob')

const exists = async filename =>
  !!(await statAsync(filename).catch(() => false))

/** @lends module:pon-task-subpack.npmrcCopy */
function npmrcCopy (base, sub) {
  async function task (ctx) {
    const { cwd, logger } = ctx
    const pkgPath = path.resolve(cwd, base)
    const pkgDir = path.dirname(pkgPath)
    const rcFile = path.resolve(pkgDir, '.npmrc')
    const rcFileExists = await exists(rcFile)
    if (!rcFileExists) {
      throw new Error(`.npmrc file not found in project root`)
    }

    const subPkgFiles = (await aglob(sub, { cwd })).map(dirname =>
      path.resolve(cwd, dirname)
    )
    for (const subPkg of subPkgFiles) {
      const subPkgDir = path.dirname(subPkg)
      const subRcFile = path.resolve(subPkgDir, '.npmrc')
      const needsCopy = !(await exists(subRcFile))
      if (needsCopy) {
        await copyAsync(rcFile, subRcFile)
        logger.debug(`Copy .npmrc to ${subRcFile}`)
      }
    }
  }

  return task
}

module.exports = npmrcCopy
