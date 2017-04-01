
const fs = require('fs')

const nearley = require('nearley')
const Compile = require('nearley/lib/compile')
const parserGrammar = require('nearley/lib/nearley-language-bootstrapped')
const generate = require('nearley/lib/generate')

function parse(grammar, input) {
  if (grammar.should) {
    grammar.should.have.keys(['ParserRules', 'ParserStart'])
  }
  var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  p.feed(input)
  return p.results
}

function compile(source) {
  // parse
  var results = parse(parserGrammar, source)

  // compile
  var c = Compile(results[0], {})

  // generate
  var compiledGrammar = generate(c, 'grammar')

  // eval
  return evalGrammar(compiledGrammar)
}

function evalGrammar(compiledGrammar) {
  var f = new Function('module', compiledGrammar)
  var m = {exports: {}}
  f(m)
  return m.exports
}

function read(filename) {
  return fs.readFileSync(filename, 'utf-8')
}

module.exports = { compile, read, parse }

