
const expect = require('expect')
const nearley = require('nearley')

const reverse = require('../reverse')


let testTree = [ "setVar:to:", "PixelX", [ "-", [ "*", [ "*", [ "%", [ "-", [ "*", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], [ "readVariable", "foo" ] ], [ "+", [ "-", [ "readVariable", "foo" ], [ "/", [ "readVariable", "foo" ], 2 ] ], [ "/", [ "*", [ "readVariable", "foo" ], [ "readVariable", "foo" ] ], 2 ] ] ], [ "readVariable", "foo" ] ], [ "readVariable", "foo" ] ], [ "readVariable", "foo" ] ], [ "/", [ "readVariable", "foo" ], 2 ] ] ]
let testLine = "set PixelX to (foo * foo * foo - (foo - foo / 2 + foo * foo / 2)) mod foo * foo * foo - foo / 2"


suite('tosh generator', () => {

  const grammar = nearley.Grammar.fromCompiled(require('../examples/tosh'))

  let clean = out => out.map(x =>
    typeof x === 'string' ? x :
    x.type === 'WS' ? ' ' :
    x.type === 'string' ? JSON.stringify(x.value) :
    x.value ? x.value :
    JSON.stringify(x)).join("")

  benchmark('nearley-reverse', () => {
    let line = reverse(grammar, testTree)
    expect(clean(line)).toEqual(testLine)
  })


  const {generateBlock} = require('./tosh')

  benchmark('tosh', () => {
    generateBlock(testTree)
    //expect(generateBlock(testTree)).toEqual(testLine)
  })

})

suite('tosh parser', () => {

  const grammar = nearley.Grammar.fromCompiled(require('../examples/tosh'))

  benchmark('nearley', () => {
    let p = new nearley.Parser(grammar)
    p.feed(testLine)
    expect(p.results[0]).toEqual(testTree)
  })

})
