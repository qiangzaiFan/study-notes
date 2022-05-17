// 记忆函数
const _ = require("lodash");

function getArea(r) {
  console.log(r);
  return Math.PI * r * r;
}

// let getAreaWithMemory = _.memoize(getArea);
// console.log(getAreaWithMemory(4));
// console.log(getAreaWithMemory(4));
// console.log(getAreaWithMemory(4));

//模拟memoize 方法的实现
function memoize(f) {
  let cash = {};
  return function () {};
}
