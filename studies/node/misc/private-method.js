'use strict'

// function privateMethod (arg) {
//   const state = this.data
// }

// class Thing {
//   doSomething (a, b) {
//     privateMethod.call(this, a)
//   }
// }

// export default Thing

/*
function Product (name, price) {
  this.name = name
  this.price = price
}

function Food (name, price) {
  Product.call(this, name, price)
  this.category = 'food'
}

function Toy (name, price) {
  Product.call(this, name, price)
  this.category = 'toy'
}

class Car {
  constructor (name, price) {
    Product.call(this, name, price)
    this.category = 'car'
  }
}

var cheese = new Food('feta', 5)
var fun = new Toy('robot', 40)
let citroen = new Car('c3', 10000)

console.log(cheese, fun, citroen)
*/

/*
class Truck {
  constructor (name, price) {
    let [_name, _price] = [name, price]
    this.category = 'truck'
  }
  print () { console.log(this) }
}

let daf = new Truck('aa', 10000)
console.log(daf)
daf.print()
*/
/*
class Person {
  constructor (name, age) {
    class Person {
      constructor (_private) {
        this.name = name
        this.age = age
        this.isHuman = _private.human
        this.greet = _private.greeting.call(this) // without 'call' it takes _private object as 'this' keyword
      }
    }

    // private properties here
    this.human = true

    return new Person(this)
  }

  // private methods here
  greeting () {
    return `hello ${this.name}`
  }
}

var person = new Person('Paul', 27)

console.log(person.name) // 'Paul'
console.log(person.age) // 27
console.log(person.isHuman) // true
console.log(person.greet) // 'Hello Paul'
console.log(person.human) // undefined (private)
console.log(person.greeting) // undefined (private)
*/
/*
class PrivatePersonDataAndMethods {
  constructor (firstAge) {
    this._age = firstAge
    this._private = true
  }
  get age () { console.log(this._age); return this._age }
  set age (newAge) { this._age = newAge; console.log(this._age) }
  aYearMore () { this._age += 1; console.log(this._age) }
  greet (that) { console.log(this._age); return `${that.name} has ${this._age}` }
}

class PublicPersonDataAndMethods {
  constructor (_this, name) {
    this.name = name
    this.public = _this._private // private property
    this.age = _this.age // private getter and setter
    this.aYearMore = _this.aYearMore
    this.greet = _this.greet.bind(_this, this) // private method
  }
  greeting () { return this.greet() }
}

class Person {
  constructor (name, age) {
    let privatePersonDataAndMethods = new PrivatePersonDataAndMethods(age)
    let publicPersonDataAndMethods = new PublicPersonDataAndMethods(privatePersonDataAndMethods, name)
    return publicPersonDataAndMethods
  }
}

let paul = new Person('Paul', 28)
console.log(paul)
console.log(paul.greeting())
paul.name = 'Paula'
paul.age = 29
paul.aYearMore()
console.log(paul)
console.log(paul.greeting())
*/
/*
class Countdown {
  constructor (counter, action) {
    Object.assign(this, {
      dec () {
        if (counter < 1) return
        counter--
        if (counter === 0) {
          action()
        }
      }
    })
  }
}

const c = new Countdown(2, () => console.log('DONE'))
console.log(c)
c.dec()
c.dec()
*/
/*
const _counter = new WeakMap()
const _action = new WeakMap()

class Countdown {
  constructor (counter, action) {
    _counter.set(this, counter)
    _action.set(this, action)
  }
  dec () {
    let counter = _counter.get(this)
    if (counter < 1) return
    counter--
    _counter.set(this, counter)
    if (counter === 0) {
      _action.get(this)()
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'))
console.log(c)
c.dec()
c.dec()
*/

let map = new WeakMap()
function my (object) {
  if (!map.has(object)) { map.set(object, {}) }
  return map.get(object)
}

class Countdown {
  constructor (counter, action) {
    // Object.assign(my(this), { counter, action })
    my(this).counter = counter
    my(this).action = action
  }
  dec () {
    let counter = my(this).counter
    if (counter < 1) return
    counter--
    my(this).counter = counter
    if (counter === 0) {
      my(this).action()
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'))
console.log(my(c))
console.log(c)
c.dec()
c.dec()
