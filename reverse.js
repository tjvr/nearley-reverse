(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory) /* global define */
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.moo = factory()
  }
}(this, function() {
  'use strict';

  function get_or_set(map, key, factory) {
    var out = map.get(key)
    if (!out) {
      map.set(key, out = factory())
    }
    return out
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

    function expand(target, value) {
      let rules = grammar.byName[target]
      if (!rules) return
      //console.log(target, value)

      var bestCost = +Infinity
      var best = null
      for (let rule of rules) {
        let array = encode(rule, value)
        if (!array) continue
        //console.log(rule.name, array)

        var cost = 0
        let part = []
        for (var k=0; k<rule.symbols.length; k++) {
          var symbol = rule.symbols[k]
          if (typeof symbol === 'string') {
            let child = generate(symbol, array[k])
            if (isNaN(child.cost)) {
              // indicates a recursive (bogus) derivation -- avoid these
              cost = +Infinity
              break
            }
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
        if (cost < bestCost) {
          best = part
          bestCost = cost
        }
      }
      return {cost: bestCost, part: best}
    }

    let byTarget = new Map()

    function generate(target, node) {
      let byFragment = get_or_set(byTarget, target, () => new Map())

      // construct Derivation object
      let derivation = get_or_set(byFragment, node, () => ({isNew: true}))

      // build shortest sequence
      if (derivation.isNew) {
        // the Derivation acts as a marker to avoid infinite recursion
        delete derivation.isNew

        let {cost, part} = expand(target, node)
        derivation.cost = cost
        derivation.sequence = part
      }
      return derivation
    }

    function flatten(out, obj) {
      for (let item of obj.sequence) {
        if (item.cost !== undefined) {
          flatten(out, item)
        } else {
          out.push(item)
        }
      }
      return out
    }

    return flatten([], generate(grammar.start, node))
  }

  return generate

}))
