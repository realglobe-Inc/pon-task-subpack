/**
 * Define task
 * @memberof module:pon-task-subpack
 * @function define
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
"use strict";

const prune = require("./prune");

const subPacks = { prune };

/** @lends module:pon-task-subpack.define */
function define(options = {}) {
  const subTasks = Object.keys(options).reduce(
    (subTasks, name) =>
      Object.assign(subTasks, {
        [name]: subPacks[name](...(options[name] || []))
      }),
    {}
  );

  function task(ctx) {
    return Promise.all([
      Object.keys(subTasks).map(name => subTasks[name](ctx))
    ]);
  }

  return Object.assign(task, subTasks);
}

module.exports = Object.assign(define, subPacks);
