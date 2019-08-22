'use strict'

const aglob = require('aglob')
const { spawnSync } = require('child_process')
const path = require('path')
const semver = require('semver')
const { readAsJson } = require('@the-/util-file')

const minVersion = version => !!version && semver.minVersion(version).version

const isLocalDep = version => /^file:/.test(version)

/**
 * 冗長な依存関係を除去
 * @memberof module:pon-task-subpack
 * @function prune
 * @param {string} base - Base package json file path
 * @param {string} sub - Sub packages file pattern
 * @param {Object} [options={}] - Optional setting
 * @param {string} [options.except=[]] - Exceptions
 * @param {boolean} [options.localDeps=true] - Should prune local deps
 * @returns {function(Object): Promise} - Pon task
 */
function prune (base, sub, options = {}) {
  const {
    except = [],
    localDeps: shouldPruneLocalDeps = true,
  } = options

  async function task (ctx) {
    const { cwd, logger } = ctx
    const pkgPath = path.resolve(cwd, base)
    const pkg = await readAsJson(pkgPath)
    const subPkgPaths = (await aglob(sub, { cwd })).map(filename =>
      path.resolve(cwd, filename)
    )
    const {
      dependencies: parentDeps = {},
      devDependencies: parentDevDeps = {}
    } = pkg
    for (const subPkgPath of subPkgPaths) {
      const subPkg = await readAsJson(subPkgPath)
      const subPkgDir = path.dirname(subPkgPath)
      const depsToPrune = Object.entries(subPkg.dependencies || {})
        .filter(([name]) => !except.includes(name))
        .filter(([name, version]) => {
          const rootVersion = parentDeps[name]
          if (!rootVersion) {
            return false
          }

          if (isLocalDep(version)) {
            return shouldPruneLocalDeps
          }
          return semver.gte(minVersion(rootVersion), minVersion(version))
        })
        .map(([name]) => name)

      if (depsToPrune.length > 0) {
        logger.info(`=== Remove ${depsToPrune} from ${subPkg.name}... === `)
        spawnSync('npm', ['un', ...depsToPrune], {
          cwd: subPkgDir,
          stdio: 'inherit'
        })
      }
      const devDepsToPrune = Object.entries(subPkg.devDependencies || {})
        .filter(([name]) => !except.includes(name))
        .filter(([name, version]) => {
          const rootVersion = parentDeps[name] || parentDevDeps[name]
          if (!rootVersion) {
            return false
          }
          if (isLocalDep(version)) {
            return shouldPruneLocalDeps
          }
          return semver.gte(minVersion(rootVersion), minVersion(version))
        })
        .map(([name]) => name)
      if (devDepsToPrune.length > 0) {
        logger.info(
          `=== Remove ${devDepsToPrune} as devDeps from ${subPkg.name}... === `
        )
        spawnSync('npm', ['un', ...devDepsToPrune, '-D'], {
          cwd: subPkgDir,
          stdio: 'inherit'
        })
      }
    }
  }

  return task
}

module.exports = prune
