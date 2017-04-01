
function generate(grammar, node) {
  function generateNode(name, node) {
    if (name.literal) {
      return name.literal
    }
    if (name.type) {
      return name
    }

    let rules = grammar.byName[name] || []
    console.log(rules)
    for (var i=rules.length; i--; ) {
      let rule = rules[i]
      console.log('#' + name)
      let factory = rule.postprocess
      let result
      if (!factory) {
        result = node || []
      } else if (factory.encode) {
        result = factory.encode(node)
        if (result === false) { continue }
        if (!Array.isArray(result)) { result = [result] }
      } else {
        continue
      }

      console.log('=> ', result)

      let out = []
      for (var j=0; j<rule.symbols.length; j++) {
        let child = generateNode(rule.symbols[j], result[j])
        if (child === false) {
          console.log('cant do', rule.symbols[j], result[j])
          break
        }
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
console.log(JSON.stringify(out))

