'use strict'

const pon = require('pon')
const ponTaskSubpack = require('pon-task-subpack')

;(async () => {
  let run = pon({
    myTask01: ponTaskSubpack()
  })

  run('myTask01')
}).catch((err) => console.error(err))
