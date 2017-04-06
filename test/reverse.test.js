
const { Generator } = require('../reverse')
const { compile, read, parse } = require('./_nearley')

function generate(grammar, json) {
  var gen = new Generator(grammar)
  return gen.generate(json)
}

describe('tosh example', () => {
  let toshGrammar = compile(read('examples/tosh.ne'))

  test('parses', () => {
    expect(parse(toshGrammar, "say 'hello'")).toEqual([['say:', 'hello']])
  })

  test('generates', () => {
    expect(generate(toshGrammar, ['say:', 'hello'])).toBe('say "hello"')
  })
})


/*
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
console.log(out)
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

*/

