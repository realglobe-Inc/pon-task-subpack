/**
 * Test case for npmrcFix.
 * Runs with mocha.
 */
'use strict'

const npmrcFix = require('../lib/npmrcFix.js')
const { mkdirpAsync, writeFileAsync, statAsync } = require('asfs')
const ponContext = require('pon-context')

describe('npmrc-fix', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Npmrc fix', async () => {
    const root = `${__dirname}/../tmp/testing-project-02`
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
    await npmrcFix(ctx)
  })
})

/* global describe, before, after, it */
