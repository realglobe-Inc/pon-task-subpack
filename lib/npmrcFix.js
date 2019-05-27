/**
 * Fix .npmrc
 * @memberof module:pon-task-subpack
 * @function npmrcFix
 * @returns {function()} - Pon task
 */
'use strict'

const { readFileAsync, writeFileAsync } = require('asfs')
const path = require('path')
const { shallowEqual } = require('asobj')
const ini = require('ini')
const aglob = require('aglob')

/** @lends module:hec-eye/misc.tasks.npmrcFix */
function npmrcFix (base, sub, options = {}) {
  const { sharedConfig = {} } = options

  async function task (ctx) {
    const { cwd, logger } = ctx
    const pkgPath = path.resolve(cwd, base)
    const pkgDir = path.dirname(pkgPath)
    const subPkgDirs = (await aglob(sub, { cwd })).map(dirname =>
      path.resolve(cwd, dirname)
    )
    for (const dir of [pkgDir, ...subPkgDirs]) {
      const filename = path.resolve(dir, '.npmrc')
      const src = await readFileAsync(filename).catch(() => null)
      if (!src) {
        continue
      }
      const current = ini.parse(String(src))
      const fixed = { ...current, ...sharedConfig }
      const noNeed = shallowEqual(fixed, current)
      if (noNeed) {
        continue
      }
      await writeFileAsync(filename, ini.stringify(fixed))
      logger.debug(`.npmrc fixed:  ${path.relative(cwd, filename)}`)
    }
  }

  return task
}

module.exports = npmrcFix
