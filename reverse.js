
function generate(grammar, node) {
  function generateNode(name, node) {
    let rules = grammar.byName[name] || []
    for (let rule of rules) {
      console.log(name)
      let factory = rule.postprocess
      let result
      if (factory.encode) {
        result = factory.encode(node)
        if (result === false) { continue }
        if (!Array.isArray(result)) { result = [result] }
      } else {
        console.log('!', rule)
        result = [node]
      }

      console.log(result)

      let out = []
      for (var i=0; i<rule.symbols.length; i++) {
        let child = generateNode(rule.symbols[i], result[i])
        if (child === false) break
        out.push(child)
      }
      if (out.length < rule.symbols.length) continue
      return out
    }
    return false
  }

  return generateNode(grammar.start, node)
}

const nearley = require('nearley')
const g = nearley.Grammar.fromCompiled(require('./tosh'))

let p = new nearley.Parser(g)
p.feed("say 'hello'")

let out = generate(g, ['say:', ['+', 1, 2]])
console.log(out)

