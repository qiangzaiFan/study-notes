// 模拟lodash中的flowRight
const _ = require("lodash");
const reverse = (arr) => arr.reverse();
const first = (arr) => arr[0];
const upperCase = (s) => s.toUpperCase();
const compose = _.flowRight(upperCase, first, reverse);


