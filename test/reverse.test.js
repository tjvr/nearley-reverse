
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

