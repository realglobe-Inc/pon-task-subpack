/**
 * 中身を同期
 * @memberof module:pon-task-subpack
 * @function sync
 * @param {string} base - Base package json file path
 * @param {string} sub - Sub packages file pattern
 * @param {function} mapper - Value mapper
 * @returns {function()} - Pon task
 */
'use strict'

const path = require('path')
const aglob = require('aglob')
const { readAsJson, writeAsJson } = require('@the-/util-file')

const readPkg = async pkgPath => ({
  pkg: await readAsJson(pkgPath),
  pkgDir: path.dirname(pkgPath)
})

const changedMessage = (path, field, prev, next) =>
  `[${path}] Sync "${field}" field ${prev} -> ${next}`

/** @lends module:pon-task-subpack.sync */
function sync (base, sub, mapper, options = {}) {
  const { onSub = null } = options
  return async function task (ctx) {
    const { cwd, logger } = ctx
    const pkgPath = path.resolve(cwd, base)
    const { pkg, pkgDir } = await readPkg(pkgPath)
    const subPkgPaths = (await aglob(sub, { cwd })).map(filename =>
      path.resolve(cwd, filename)
    )
    for (const subPkgPath of subPkgPaths) {
      const { pkg: subPkg, pkgDir: subPkgDir } = await readPkg(subPkgPath)

      const fieldsMap = mapper({
        pkg,
        pkgDir,
        subPkg,
        subPkgDir
      })
      const fields = Object.keys(fieldsMap)
      if (fields.length === 0) {
        return
      }
      for (const field of fields) {
        logger.notice(
          changedMessage(
            path.relative(cwd, subPkgPath),
            field,
            JSON.stringify(subPkg[field]),
            JSON.stringify(fieldsMap[field])
          )
        )
      }
      await writeAsJson(subPkgPath, {
        ...subPkg,
        ...fieldsMap
      })
      onSub && onSub({
        subPkgPath,
        subPkgDir,
      })
    }
  }
}

module.exports = sync
