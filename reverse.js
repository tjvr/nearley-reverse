

class Deriving {
  constructor(target, node) {
    this.target = target
    this.node = node
  }
}

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

function expand(grammar, deriving, cb) {
  let target = deriving.target
  let value = deriving.node

  let rules = grammar.byName[target]
  for (let rule of rules) {
    let array = encode(rule, value)
    if (!array) continue
    //console.log(rule.name, array)

    var cost = 0
    let part = []
    for (var k=0; k<rule.symbols.length; k++) {
      var symbol = rule.symbols[k]
      if (typeof symbol === 'string') {
        part.push(new Deriving(symbol, array[k]))
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
    cb(cost, part)
  }
}

function generate(grammar, node) {
  let queue = new PQueue()
  queue.insert({cost: 0, sequence: [new Deriving(grammar.start, node)]})

  while (true) {
    let result = queue.pop()
    if (!result) return
    let sequence = result.sequence
    //console.log(sequence)

    for (var i=0; i<sequence.length; i++) {
      let deriving = sequence[i]
      if (!(deriving instanceof Deriving)) continue

      expand(grammar, deriving, (cost, part) => {
        let newSeq = []
        for (var j=0; j<i; j++) newSeq.push(sequence[j])
        for (var k=0; k<part.length; k++) newSeq.push(part[k])
        for (var j=i+1; j<sequence.length; j++) newSeq.push(sequence[j])
        queue.insert({cost: result.cost + cost, sequence: newSeq})
      })
      break
    }
    if (i === sequence.length) {
      return sequence
    }
  }
}

const nearley = require('nearley')
const g = nearley.Grammar.fromCompiled(require('./tosh'))

let p = new nearley.Parser(g)
p.feed("say 'hello'")

var alpha = ["-", [ "readVariable", "foo" ], [ "/", [ "readVariable", "foo" ], 2 ] ]
var beta = [ "/", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], 2 ]
//let test = [ "setVar:to:", "PixelX", [ "=", alpha, beta ] ]
//let test = [ "setVar:to:", "PixelX", alpha ]
let test = [ "gotoX:y:", ["-", 1, ["*", 2, 3]], ["/", 4, 5]]

//let test = ['say:duration:elapsed:from:', 'hello', ['+', 1, ['*', 2, 3]]]
//let test = ["setVar:to:", "PixelX", 44]
//let test = ["setVar:to:", "PixelX", ["-", ["%", 1, 2], 3]]

let out = generate(g, test)
console.log(out)
console.log(out.map(x =>
  typeof x === 'string' ? x :
  x.type === 'WS' ? ' ' :
  x.type === 'string' ? JSON.stringify(x.value) :
  x.value ? x.value :
  JSON.stringify(x)).join("")
)

