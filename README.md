# react-parade

[![npm](https://img.shields.io/npm/v/react-parade.svg?style=flat-square)](https://www.npmjs.com/package/react-parade)
[![npm](https://img.shields.io/npm/dm/react-parade.svg?style=flat-square)](https://www.npmjs.com/package/react-parade)
[![Travis](https://img.shields.io/travis/kthjm/react-parade.svg?style=flat-square)](https://travis-ci.org/kthjm/react-parade)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/react-parade.svg?style=flat-square)](https://codecov.io/gh/kthjm/react-parade)
[![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/react-parade/dist/min.js)

## Installation
```shell
yarn add react-parade
```

## Usage
```js
import React from 'react'
import Parade from 'react-parade'

const d = 'c 50,0 50,100 100,100 50,0 50,-100 100,-100'

export default () =>
  <svg viewBox='0 0 600 600' >
    <Parade {...{ d }}>
      <g fill='#483746'>
        <circle r='5' />
        <circle r='10' />
        <circle r='15' />
      </g>
    </Parade>
  </svg>
```
## Props

#### `d: string`
required as The path information for line animation.

#### `pace: number = 1`
animation's pace.

#### `pause: boolean`
To stop animation.

## Supported Node
They will be extracted as raw-dom from `props.children`.
* circle
* ellipse
* rect
* image


## License
MIT (http://opensource.org/licenses/MIT)