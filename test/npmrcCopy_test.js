/**
 * Test case for npmrcCopy.
 * Runs with mocha.
 */
'use strict'

const npmrcCopy = require('../lib/npmrcCopy.js')
const { ok } = require('assert').strict
const { mkdirpAsync, writeFileAsync, statAsync } = require('asfs')
const ponContext = require('pon-context')

describe('npmrc-copy', function () {
  this.timeout(3000)

  before(async () => {})

  after(async () => {})

  it('Npmrc copy', async () => {
    const root = `${__dirname}/../tmp/testing-project-01`
    await mkdirpAsync(root)
    await writeFileAsync(`${root}/.npmrc`, '')
    await writeFileAsync(
      `${root}/package.json`,
      JSON.stringify({ name: 'testing-project01' })
    )
    await mkdirpAsync(`${root}/packages/p1`)
    await writeFileAsync(
      `${root}/packages/p1/package.json`,
      JSON.stringify({ name: '@testing-project01/p1' })
    )

    const ctx = ponContext()
    await npmrcCopy(`${root}/package.json`, `${root}/packages/*/package.json`)(ctx)

    ok(await statAsync(`${root}/packages/p1/.npmrc`))
  })
})

/* global describe, before, after, it */
