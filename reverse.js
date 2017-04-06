
var Generator = function(grammar) {

function get_or_set(map, key, factory) {
  var out = map.get(key)
  if (!out) {
    map.set(key, out = factory())
  }
  return out
}

class Deriving {
  constructor(target, node) {
    this.target = target
    this.node = node
    this.cost = null
  }

  init() {
    if (this.cost !== null) return
    this.cost = +Infinity
    this.queue = new PQueue()
    expand(this, (cost, part) => {
      this.queue.insert({cost: cost, sequence: part})
      this.cost = Math.min(cost, this.cost)
    })
  }

  static get(target, node) {
    let byNode = get_or_set(Deriving.byTarget, target, () => new Map())
    let deriving = get_or_set(byNode, node, () => new Deriving(target, node))
    deriving.init()
    return deriving
  }

  best(maxCost) {
    let queue = this.queue
    while (this.cost <= maxCost) {
      let way = queue.pop()
      if (!way) return {cost: +Infinity, valid: false}

      var cost = 0
      let sequence = way.sequence
      var valid = true
      for (let item of sequence) {
        if (item instanceof Deriving) {
          let result = item.best(maxCost - cost)
          cost += result.cost
          if (!result.valid) {
            valid = false
          }
        } else {
          cost++
        }
        if (cost > maxCost) break
      }
      way.cost = cost
      queue.insert(way)
      this.cost = queue.best()
      if (valid && cost <= maxCost) {
        return {cost: this.cost, valid: true}
      }
    }
    return {cost: this.cost, valid: false}
  }

  get() {
    let way = this.queue.peek()
    let sequence = way.sequence
    let result = []
    for (var i=0; i<sequence.length; i++) {
      let item = sequence[i]
      if (item instanceof Deriving) {
        let part = item.get()
        for (var j=0; j<part.length; j++) {
          result.push(part[j])
        }
      } else {
        result.push(sequence[i])
      }
    }
    return result
  }
}
Deriving.byTarget = new Map()

class PQueue {
  constructor() {
    this.first = null
  }

  insert(value) {
    if (!this.first) {
      this.first = {value: value, next: null}
      return
    }
    var item = this.first
    var previous = null
    // nb. < vs <= is a significant perf difference!
    while (item !== null && item.value.cost < value.cost) {
      previous = item
      item = item.next
    }
    if (!previous) {
      this.first = {value: value, next: item}
    } else {
      previous.next = {value: value, next: item}
    }
  }

  pop() {
    if (!this.first) { return }
    let item = this.first
    this.first = item.next
    return item.value
  }

  peek() {
    if (!this.first) { return }
    return this.first.value
  }

  best() {
    let value = this.peek()
    return value ? value.cost : +Infinity
  }
}

function encode(rule, node) {
  let factory = rule.postprocess
  if (!factory) {
    return node || []
  } else if (factory.encode) {
    var result = factory.encode(node)
    if (result === false) return
    if (!Array.isArray(result)) { result = [result] }
    return result
  }
}

function expand(deriving, cb) {
  let target = deriving.target
  let value = deriving.node
  let rules = grammar.byName[target]
  if (!rules) return
  //console.log(target, value)

  for (let rule of rules) {
    let array = encode(rule, value)
    if (!array) continue
    //console.log(rule.name, array)

    var cost = 0
    let part = []
    for (var k=0; k<rule.symbols.length; k++) {
      var symbol = rule.symbols[k]
      if (typeof symbol === 'string') {
        let child = Deriving.get(symbol, array[k], minCost(symbol))
        cost += child.cost
        part.push(child)
      } else {
        cost++
        if (symbol.literal) {
          symbol = symbol.literal
        } else if (symbol.type && array[k]) {
          symbol = Object.assign({}, symbol, {value: array[k]})
        }
        part.push(symbol)
      }
    }
    //console.log(rule.name, '->', cost, array, rule.symbols)
    cb(cost, part)
  }
}

function generate(deriving) {
  var maxCost = deriving.cost
  // iterative deepening
  /*
  console.log(maxCost)
  var result
  do {
    result = deriving.best(maxCost)
    console.log(result)
    maxCost++
  } while (!result.valid && result.cost < +Infinity)

  if (result.valid) {
  */
    console.log('yay')
    return deriving.get()
  // }

  return null
}

function generateStart(node) {
  let target = grammar.start
  let cost = minCost(grammar.start)
  return generate(Deriving.get(target, node))
}

let cache = new Map()

function minCost(target) {
  let cached = cache.get(target)
  if (cached !== undefined) return cached
  cache.set(target, 1)

  let rules = grammar.byName[target] || []
  var min = +Infinity
  for (let rule of rules) {
    var cost = 0
    for (let sym of rule.symbols) {
      if (typeof sym === 'string') {
        cost += minCost(sym)
      } else {
        cost++
      }
    }
    min = Math.min(min, cost)
  }
  cache.set(target, min)
  return min
}

return {generate: generateStart}

}

const nearley = require('nearley')
const g = nearley.Grammar.fromCompiled(require('./tosh'))
let gen = Generator(g)

let p = new nearley.Parser(g)
p.feed("say 'hello'")

var alpha = ["-", [ "readVariable", "foo" ], [ "/", [ "readVariable", "foo" ], 2 ] ]
var beta = [ "/", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], 2 ]
//let test = [ "setVar:to:", "PixelX", [ "=", alpha, beta ] ]
//let test = [ "setVar:to:", "PixelX", alpha ]
let test = [ "gotoX:y:", ["-", 1, ["*", 2, 3]], ["/", 4, ["-", 5, 6]]]

//let test = ['say:duration:elapsed:from:', 'hello', ['+', 1, ['*', 2, 3]]]
//let test = ["setVar:to:", "PixelX", 44]
//let test = ["setVar:to:", "PixelX", ["-", ["%", 1, 2], 3]]

let out = gen.generate(test)
//let out = generate(g, new Deriving('sb', ["*", 1, ["+", 2, 3]]), minCost(g, 'sb'))
console.log(out)
console.log(out.map(x =>
  typeof x === 'string' ? x :
  x.type === 'WS' ? ' ' :
  x.type === 'string' ? JSON.stringify(x.value) :
  x.value ? x.value :
  JSON.stringify(x)).join("")
)

