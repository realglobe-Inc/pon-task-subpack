/**
 * Manage sub packages for monorepo
 * @module pon-task-subpack
 * @version 1.0.4
 */

'use strict'

const define = require('./define')

const lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
