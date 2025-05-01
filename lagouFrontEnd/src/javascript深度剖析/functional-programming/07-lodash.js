// 演示lodash
// first / last / toUpper / reverse /each /includes /find /findIndex
const _ = require("lodash");

const array = ["jack", "tom", "lucky", "kate"];

console.log(_.first(array));
console.log(_.last(array));
console.log(_.toUpper(_.first(array)));
console.log(_.reverse(array));
console.log(
  _.each(array, (item, index) => {
    console.log(item, index);
  })
);
