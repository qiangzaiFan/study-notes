// point free
// Hello   World --> hello_world

// 非 point free 模式
const _ = require('lodash')
const fp = require('lodash/fp')

const compoise = word => {
  return word.toLowerCase().replace(/\s+/g, '_')
}
console.log(compoise('Hello   World'))

// point free 模式

const f = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)
console.log(f('Hello   World'))
