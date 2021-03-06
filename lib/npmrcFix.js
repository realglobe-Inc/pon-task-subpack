/**
 * Fix .npmrc
 * @memberof module:pon-task-subpack
 * @function npmrcFix
 * @param {string} base - Base package json file path
 * @param {string} sub - Sub packages file pattern
 * @param {Object} config - Config
 * @returns {function()} - Pon task
 */
"use strict";

const { readFileAsync, writeFileAsync } = require("asfs");
const path = require("path");
const { shallowEqual } = require("asobj");
const ini = require("ini");
const aglob = require("aglob");

/** @lends module:pon-task-subpack.npmrcFix */
function npmrcFix(base, sub, config, options = {}) {
  async function task(ctx) {
    const { cwd, logger } = ctx;
    const pkgPath = path.resolve(cwd, base);
    const pkgDir = path.dirname(pkgPath);
    const subPkgPaths = (await aglob(sub, { cwd })).map(dirname =>
      path.resolve(cwd, dirname)
    );
    const subPkgDirs = subPkgPaths.map(subPkgPath => path.dirname(subPkgPath));
    for (const dir of [pkgDir, ...subPkgDirs]) {
      const filename = path.resolve(dir, ".npmrc");
      const src = await readFileAsync(filename).catch(() => null);
      if (!src) {
        continue;
      }
      const current = ini.parse(String(src));
      const fixed = { ...current, ...(config || {}) };
      const noNeed = shallowEqual(fixed, current);
      if (noNeed) {
        continue;
      }
      await writeFileAsync(filename, ini.stringify(fixed));
      logger.debug(`.npmrc fixed:  ${path.relative(cwd, filename)}`);
    }
  }

  return task;
}

module.exports = npmrcFix;
