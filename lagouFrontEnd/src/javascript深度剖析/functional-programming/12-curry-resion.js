// 模拟实现lodash中的curry方法
const _ = require("lodash");
function getSum(a, b, c) {
  return a + b + c;
}
const curried = _.curry(getSum);
console.log(curried(1, 2, 3));
console.log(curried(1)(2, 3));
console.log(curried(1, 2)(3));

function curry(func) {
  return function curried(...args) {
    if (args.length < func.length) {
      return function () {
        return curried(...args.concat(Array.from(arguments)));
      };
    }
    return func(...args);
  };
}

const curriedmoni = curry(getSum);
console.log(curriedmoni(1, 2, 3));
console.log(curriedmoni(1)(2, 3));
console.log(curriedmoni(1, 2)(3));
