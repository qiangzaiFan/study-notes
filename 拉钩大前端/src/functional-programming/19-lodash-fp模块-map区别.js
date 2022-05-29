// lodash 和 lodash中的fp模块，map方法的区别
// 小技巧，vscode，输入方法（）的时候，能看到方法需要传入的参数，iteratee 是函数的意思

const _ = require('lodash')

// 打印的值为 [ 23, NaN, 2 ]，为什么会这样，因为parseInt 的第二个参数是转化进制，
console.log(_.map(['23', '8', '10'], parseInt))
// 模拟上面函数parseInt的执行，0是10进制，1没有这个定义，2是二进制，所以打印出NaN, 二进制的数字只有0 1
// parseInt('23',0,array)
// parseInt('8',1,array)
// parseInt('10',2,array)

const fp = require('lodash/fp')
// [ 23, 8, 10 ],打印出正常的值，这个fp中的parseInt 只需要处理数组中的每一个元素，lodash中的parseInt的方法需要传入3个参数
console.log(fp.map(parseInt, ['23', '8', '10']))
