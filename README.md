pon-task-subpack
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/realglobe-Inc/pon-task-subpack
[bd_travis_url]: http://travis-ci.org/realglobe-Inc/pon-task-subpack
[bd_travis_shield_url]: http://img.shields.io/travis/realglobe-Inc/pon-task-subpack.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/realglobe-Inc/pon-task-subpack
[bd_travis_com_shield_url]: https://api.travis-ci.com/realglobe-Inc/pon-task-subpack.svg?token=
[bd_license_url]: https://github.com/realglobe-Inc/pon-task-subpack/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/realglobe-Inc/pon-task-subpack
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/realglobe-Inc/pon-task-subpack.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/realglobe-Inc/pon-task-subpack.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/realglobe-Inc/pon-task-subpack
[bd_gemnasium_shield_url]: https://gemnasium.com/realglobe-Inc/pon-task-subpack.svg
[bd_npm_url]: http://www.npmjs.org/package/pon-task-subpack
[bd_npm_shield_url]: http://img.shields.io/npm/v/pon-task-subpack.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Manage sub packages for monorepo

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install pon-task-subpack --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

```javascript
'use strict'

const pon = require('pon')
const ponTaskSubpack = require('pon-task-subpack')

;(async () => {
  let run = pon({
    myTask01: ponTaskSubpack()
  })

  run('myTask01')
}).catch((err) => console.error(err))

```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/03.Signature.md.hbs" Start -->

<a name="section-doc-guides-03-signature-md"></a>

Signatures
---------


### `define(options) -> function`

Define task

| Param | type | Description |
| ---- | --- | ----------- |
| options | Object |  Optional settings |


### `npmrcCopy(base, sub) -> function()`

Copy .npmrc file to sub package directories

| Param | type | Description |
| ---- | --- | ----------- |
| base | string |  Base package json file path |
| sub | string |  Sub packages file pattern |


### `npmrcFix(base, sub, config) -> function()`

Fix .npmrc

| Param | type | Description |
| ---- | --- | ----------- |
| base | string |  Base package json file path |
| sub | string |  Sub packages file pattern |
| config | Object |  Config |


### `prune(base, sub, options) -> function(Object): Promise`

冗長な依存関係を除去

| Param | type | Description |
| ---- | --- | ----------- |
| base | string |  Base package json file path |
| sub | string&#124;string[] |  Sub packages file pattern |
| options | Object |  Optional setting |
| options.except | string |  Exceptions |
| options.localDeps | boolean |  Should prune local deps |


### `sync(base, sub, mapper, options) -> function()`

中身を同期

| Param | type | Description |
| ---- | --- | ----------- |
| base | string |  Base package json file path |
| sub | string |  Sub packages file pattern |
| mapper | function |  Value mapper |
| options | Object |  Optional setting |



<!-- Section from "doc/guides/03.Signature.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [Apache-2.0 License](https://github.com/realglobe-Inc/pon-task-subpack/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [Pon][pon_url]
+ [Realglobe, Inc.][realglobe,_inc__url]

[pon_url]: https://github.com/realglobe-Inc/pon
[realglobe,_inc__url]: http://realglobe.jp

<!-- Links End -->
