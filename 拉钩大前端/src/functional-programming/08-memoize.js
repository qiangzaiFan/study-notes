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
  return function () {
    console.log("---arguments,", arguments, JSON.stringify(arguments));
    let key = JSON.stringify(arguments);
    cash[key] = cash[key] || f.apply(f, arguments);
    // console.log("---cash,", cash);
    return cash[key];
  };
}

let getAreaWithMemory = memoize(getArea);
console.log(getAreaWithMemory(4));
console.log(getAreaWithMemory(4));
console.log(getAreaWithMemory(4));
