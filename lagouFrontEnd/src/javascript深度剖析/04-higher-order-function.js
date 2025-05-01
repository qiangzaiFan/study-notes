function makeFn() {
  let msg = "hello function";
  return function () {
    console.log(msg);
  };
}
// const fn = makeFn();
// console.log(fn());

// makeFn()();

// jQuery中有一个once函数，Lodash中也有一个这个函数。目的是为了让函数只调用一次，使用场景例如：支付的时候，无论点击多少次，就只能调用一次。

function once(fn) {
  let done = false;
  return function () {
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  };
}

let pay = once(function (money) {
  console.log("---支付,", money + "元");
});

pay(4);
