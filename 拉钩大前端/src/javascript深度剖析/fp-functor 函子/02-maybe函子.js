// MayBe 函子

class MayBe {
  static of(value) {
    return new MayBe(value)
  }
  constructor(value) {
    this._value = value
  }

  map(fn) {
    // 返回前对this._value进行空值判断
    return this.isNothing ? MayBe.of(null) : fn(this._value)
  }

  isNothing() {
    return this._value === null || this._value === undefined
  }
}

// MayBe { _value: null }
// let r = MayBe.of('hello world').map(x => x.toUpperCase())

// 会得到null的结果，但是我们不知道什么时候出现的（虽然我们可以出现空值，但是多次调用map的时候，哪一次出现空值，我们是不明确的），这个时候我们需要Either函子
// MayBe { _value: null }
let r = MayBe.of('hello world')
  .map(x => x.toUpperCase())
  .map(x => null)
  .map(x => x.split(' '))
console.log(r)
