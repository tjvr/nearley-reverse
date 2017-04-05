

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

      let target = deriving.target
      let value = deriving.node
      let rules = grammar.byName[target]
      if (!rules) break
      for (let rule of rules) {
        let array = encode(rule, value)
        if (!array) continue

        //console.log(rule.name, array)

        var cost = result.cost
        let newSeq = []
        for (var j=0; j<i; j++) newSeq.push(sequence[j])
        for (var k=0; k<rule.symbols.length; k++) {
          var symbol = rule.symbols[k]
          if (typeof symbol === 'string') {
            newSeq.push(new Deriving(symbol, array[k]))
          } else {
            cost++
            if (symbol.literal) symbol = symbol.literal
            else if (symbol.type && array[k]) symbol.value = array[k]
            newSeq.push(symbol)
          }
        }
        for (var j=i+1; j<sequence.length; j++) newSeq.push(sequence[j])
        queue.insert({cost: cost, sequence: newSeq})
      }
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

let out = generate(g, ['say:duration:elapsed:from:', 'hello', ['*', 1, ['+', 2, 3]]])
console.log(out)
console.log(out.map(x =>
  typeof x === 'string' ? x :
  x.type === 'WS' ? ' ' :
  x.type === 'string' ? JSON.stringify(x.value) :
  x.value ? x.value :
  JSON.stringify(x)).join("")
)

