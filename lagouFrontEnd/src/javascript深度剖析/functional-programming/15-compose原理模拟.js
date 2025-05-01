// 模拟lodash中的flowRight
const _ = require("lodash");
const reverse = (arr) => arr.reverse();
const first = (arr) => arr[0];
const upperCase = (s) => s.toUpperCase();
// const f = _.flowRight(upperCase, first, reverse);
// console.log(f(["one", "two", "three"]));

function compose(...args) {
  return function (value) {
    return args.reverse().reduce((acc, fn) => {
      return fn(acc);
    }, value);
  };
}
let f = compose(upperCase, first, reverse);
console.log(f(["one", "two", "three"]));
