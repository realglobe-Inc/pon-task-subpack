/**
 * 冗長な依存関係を除去
 * @memberof module:pon-task-subpack
 * @function prune
 * @param {string} base - Base package json file path
 * @param {string} sub - Sub packages file pattern
 * @returns {function()} - Pon task
 */
'use strict'

const aglob = require('aglob')
const { spawnSync } = require('child_process')
const path = require('path')
const semver = require('semver')
const { readAsJson } = require('@the-/util-file')

const minVersion = version => !!version && semver.minVersion(version).version

const isLocalDep = version => /^file:/.test(version)

/** @lends module:pon-task-subpack.prune */
function prune (base, sub, options = {}) {
  async function task (ctx) {
    const { cwd, logger } = ctx
    const pkgPath = path.resolve(cwd, base)
    const pkg = await readAsJson(pkgPath)
    const subPkgPaths = (await aglob(sub, { cwd })).map(filename =>
      path.resolve(cwd, filename)
    )
    const {
      dependencies: parentDeps = {},
      devDependencies: parentDevDeps = {},
    } = pkg
    for (const subPkgPath of subPkgPaths) {
      const subPkg = await readAsJson(subPkgPath)
      const subPkgDir = path.dirname(subPkgPath)
      const depsToShare = Object.entries(subPkg.dependencies || {})
        .filter(([, version]) => !isLocalDep(version))
        .filter(([name, version]) => {
          const rootVersion = parentDeps[name]
          return (
            !!rootVersion &&
            semver.gte(minVersion(rootVersion), minVersion(version))
          )
        })
        .map(([name]) => name)

      if (depsToShare.length > 0) {
        logger.info(`=== Remove ${depsToShare} from ${subPkg.name}... === `)
        spawnSync('npm', ['un', ...depsToShare], {
          cwd: subPkgDir,
          stdio: 'inherit'
        })
      }
      const devDepsToShare = Object.entries(subPkg.devDependencies || {})
        .filter(([, version]) => !isLocalDep(version))
        .filter(([name, version]) => {
          const rootVersion =
            parentDeps[name] || parentDevDeps[name]
          return (
            !!rootVersion &&
            semver.gte(minVersion(rootVersion), minVersion(version))
          )
        })
        .map(([name]) => name)
      if (devDepsToShare.length > 0) {
        logger.info(
          `=== Remove ${devDepsToShare} as devDeps from ${subPkg.name}... === `
        )
        spawnSync('npm', ['un', ...devDepsToShare, '-D'], {
          cwd: subPkgDir,
          stdio: 'inherit'
        })
      }
    }
  }

  return task
}

module.exports = prune
