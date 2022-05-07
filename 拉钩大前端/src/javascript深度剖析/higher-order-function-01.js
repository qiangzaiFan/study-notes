// 高阶函数-函数作为参数
function forEach(array, fn) {
  for (let index = 0; index < array.length; index++) {
    fn(array[index]);
  }
}
let numberList = [1, 3, 5, 6, 7, 8];
// forEach(numberList, function (value) {
//   console.log(value);
// });

function filter(array, fn) {
  let results = [];
  for (let index = 0; index < array.length; index++) {
    if (fn(array[index])) {
      results.push(array[index]);
    }
  }
  return results;
}

let res = filter(numberList, function (value) {
  return value % 2 === 0;
});

console.log(res);
