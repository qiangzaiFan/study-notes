// 函数组合 调试
// NEVER SAY DIE --> never-say-die

const { flowRight } = require("lodash");
const _ = require("lodash");

// const log = (v) => {
//   console.log(v);
//   return v;
// };

const trace = _.curry((tag, v) => {
  console.log(tag, v);
  return v;
});

// _.split()
const split = _.curry((sep, str) => _.split(str, sep));

// _.toLower()

const join = _.curry((sep, array) => _.join(array, sep));
const map = _.curry((fn, array) => _.map(array, fn));
// 我们需要返回的是数组，
const f = flowRight(
  join("-"),
  trace("map之后"),
  map(_.toLower),
  trace("split之后"),
  split(" ")
);
// const f = flowRight(join("-"), log, _.toLower, split(" "));

console.log(f("NEVER SAY DIE"));
