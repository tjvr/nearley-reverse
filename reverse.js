
var generate = function(grammar, node) {

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
    this.best = null
    expand(this, (cost, part) => {
      if (cost < this.cost) {
        this.cost = cost
        this.best = part
      }
    })
  }

  static get(target, node) {
    let byNode = get_or_set(Deriving.byTarget, target, () => new Map())
    let deriving = get_or_set(byNode, node, () => new Deriving(target, node))
    deriving.init()
    return deriving
  }

  get() {
    let sequence = this.best
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
        let child = Deriving.get(symbol, array[k])
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

let deriving = Deriving.get(grammar.start, node)
return deriving.get()

}

const nearley = require('nearley')
const g = nearley.Grammar.fromCompiled(require('./tosh'))

var p = new nearley.Parser(g)
p.feed("say 'hello'")

//var alpha = ["-", [ "readVariable", "foo" ], [ "/", [ "readVariable", "foo" ], 2 ] ]
//var beta = [ "/", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], 2 ]
//let test = [ "setVar:to:", "PixelX", [ "*", alpha, beta ] ]
//let test = [ "gotoX:y:", ["-", 1, ["*", 2, 3]], ["/", 4, ["-", 5, 6]]]
let test = [ "setVar:to:", "PixelX", [ "-", [ "*", [ "*", [ "%", [ "-", [ "*", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], [ "readVariable", "foo" ] ], [ "+", [ "-", [ "readVariable", "foo" ], [ "/", [ "readVariable", "foo" ], 2 ] ], [ "/", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], 2 ] ] ], [ "readVariable", "foo" ] ], [ "readVariable", "foo" ] ], [ "readVariable", "foo" ] ], [ "/", [ "readVariable", "foo" ], 2 ] ] ]

//let test = ['say:duration:elapsed:from:', 'hello', ['+', 1, ['*', 2, 3]]]
//let test = ["setVar:to:", "PixelX", 44]
//let test = ["setVar:to:", "PixelX", ["-", ["%", 1, 2], 3]]

let out = generate(g, test)
//console.log(out)
let text = out.map(x =>
  typeof x === 'string' ? x :
  x.type === 'WS' ? ' ' :
  x.type === 'string' ? JSON.stringify(x.value) :
  x.value ? x.value :
  JSON.stringify(x)).join("")
console.log(text)

p = new nearley.Parser(g)
p.feed(text)

let expect = require('expect')
expect(p.results[0]).toEqual(test)
console.log(JSON.stringify(p.results[0]))
console.log(JSON.stringify(test))

