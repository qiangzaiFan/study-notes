// Functor 函子

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

// let r = Container.of(5)
//   .map(x => x + 2)
//   .map(x => x * x)
// console.log(r)

// 演示 null undefined 的问题

// Cannot read property 'toUpperCase' of null
Container.of(null).map(x => x.toUpperCase())
