// 结合律
// lodash中函数组合方法 _.flowRight()
const _ = require("lodash");

// const f = _.flowRight(_.upperCase, _.first, _.reverse);
// const f = _.flowRight(_.flowRight(_.upperCase, _.first), _.reverse);
const f = _.flowRight(_.upperCase, _.flowRight(_.first, _.reverse));

console.log(f(["one", "two", "three", "four"]));
