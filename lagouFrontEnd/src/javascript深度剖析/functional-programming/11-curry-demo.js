// 柯里化案例
// "".match(/\s+/g);
// "".match(/\d+/g);

const _ = require("lodash");

// 普通方法匹配
// function matchStr(reg, str) {
//   return str.match(reg);
// }

// 使用柯里化的方式
const match = _.curry(function (reg, str) {
  return str.match(reg);
});

const haveSpace = match(/\s+/g);
const haveNumber = match(/\d+/g);

// 会把空白字符给提取出来，返回一个数组的形式 [ ' ' ]
// console.log(haveSpace("hello world"));
// // 没有空格， 没有匹配到，返回null
// console.log(haveSpace("helloworld"));
// console.log(haveNumber("abc"));

// 写一个filter的柯里化函数
const filter = _.curry(function (fun, array) {
  return array.filter(fun);
});

console.log(filter(haveSpace, ["ab c", "ab_c"]));

// 另一种写法

const filterSpace = filter(haveSpace);
console.log(filterSpace(["ab c", "ab_c"]));
