// map every some 高阶函数实现

// map
let arr = [1, 2, 3, 5, 7, 8];
function map(array, fn) {
  let results = [];
  for (let item of array) {
    results.push(fn(item));
  }
  return results;
}

// console.log(map(arr, (v) => v * v));

// every
function every(array, fn) {
  let flag = false;
  for (let item of array) {
    flag = fn(item);
    if (!flag) {
      break;
    }
  }
  return flag;
}
// console.log(every(arr, (v) => v > 3));

// some
function some(array, fn) {
  let flag = false;
  for (let item of array) {
    flag = fn(item);
    if (flag) {
      break;
    }
  }
  return flag;
}

console.log(some(arr, (v) => v > 3));
