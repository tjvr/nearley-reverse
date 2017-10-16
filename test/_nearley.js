
const fs = require('fs')

const nearley = require('nearley')
const Compile = require('nearley/lib/compile')
const parserGrammar = require('nearley/lib/nearley-language-bootstrapped')
const generate = require('nearley/lib/generate')

function parse(grammar, input) {
  if (grammar.should) {
    grammar.should.have.keys(['ParserRules', 'ParserStart'])
  }
  var p = new nearley.Parser(grammar)
  p.feed(input)
  return p.results
}

function compile(source) {
  // parse
  var results = parse(parserGrammar, source)

  // compile
  var c = Compile(results[0], {})

  // generate
  var source = generate(c, 'grammar')

  // eval
  return evalGrammar(source)
}


function requireFromString(source) {
    var module = {exports: null};
    eval(source)
    return module.exports;
}

function evalGrammar(source) {
    const exports = requireFromString(source);
    return new nearley.Grammar.fromCompiled(exports);
}

function read(filename) {
  return fs.readFileSync(filename, 'utf-8')
}

module.exports = { compile, read, parse }

