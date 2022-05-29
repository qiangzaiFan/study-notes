// Functor 函子

// class Container {
//   constructor(value) {
//     this._value = value
//   }

//   map(fn) {
//     return new Container(fn(this._value))
//   }
// }

// 调用的时候不像函数式编程，像面向对象，所以创建static 静态方法内部使用构造函数创建对象
// let r = new Container(5).map(x => x + 1).map(x => x * x)

// console.log(r)

class Container {
  static of(value) {
    return new Container(value)
  }
  constructor(value) {
    this._value = value
  }
  map(fn) {
    return Container.of(fn(this._value))
  }
}

let r = Container.of(5)
  .map(x => x + 2)
  .map(x => x * x)
console.log(r)
