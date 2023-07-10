// folktale 中的compose 、 curry

const { compose, curry } = require('folktale/core/lambda')
const { first, toUpper } = require('lodash/fp')

// curry 使用
// let f = curry(2, function (x, y) {
//   return x + y
// })

// 3 3
// console.log(f(1, 2))
// console.log(f(1)(2))

// compose 使用

// 跟lodash/fp中的flowRight一样，也是从右往左执行
let r = compose(toUpper, first)
// ONE
console.log(r(['one', 'two']))
