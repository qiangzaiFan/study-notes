// // 普通的纯函数
// function checkAge(min, age) {
//   return age >= min;
// }
// console.log(checkAge(18, 20));
// console.log(checkAge(18, 24));
// console.log(checkAge(22, 24));

// 函数的柯里化
// function checkAge(min) {
//   return function (age) {
//     return age >= min;
//   };
// }

// 箭头函数改写

const checkAge = (min) => (age) => age >= min;

let checkAge18 = checkAge(18);
let checkAge20 = checkAge(20);

console.log(checkAge18(22));
console.log(checkAge18(24));
console.log(checkAge18(13));
