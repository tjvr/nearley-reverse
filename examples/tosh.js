// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


const moo = require('moo')

let lexer = moo.compile([
  {name: 'WS',      match: /[ \t]+/},
  {name: 'ellips',  match: /\.{3}/},
  {name: 'comment', match: /\/{2}(.*)$/},
  {name: 'false',   match: /\<\>/},
  {name: 'zero',    match: /\(\)/},
  {name: 'empty',   match: /_( |$)/},
  {name: 'number',  match: /([0-9]+(?:\.[0-9]+)?e-?[0-9]+)/}, // 123[.123]e[-]123
  {name: 'number',  match: /((?:0|[1-9][0-9]*)?\.[0-9]+)/},   // [123].123
  {name: 'number',  match: /((?:0|[1-9][0-9]*)\.[0-9]*)/},    // 123.[123]
  {name: 'number',  match: /(0|[1-9][0-9]*)/},              // 123
  {name: 'color',   match: /#([A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?)/},
  {name: 'string',  match: /"((?:\\["\\]|[^\n"\\])*)"/}, // strings are backslash-escaped
  {name: 'string',  match: /'((?:\\['\\]|[^\n'\\])*)'/},
  {name: 'lparen',  match: /\(/},
  {name: 'rparen',  match: /\)/},
  {name: 'langle',  match: /\</},
  {name: 'rangle',  match: /\>/},
  {name: 'lsquare', match: /\[/},
  {name: 'rsquare', match: /\]/},
  {name: 'cloud',   match: /[☁]/},
  {name: 'input',   match: /%[a-z](?:\.[a-zA-Z]+)?/},
  {name: 'symbol',  match: /[-%#+*/=^,?]/},                // single character
  {name: 'symbol',  match: /[_A-Za-z][-_A-Za-z0-9:',.]*/}, // word, as in a block
  {name: 'iden',    match: /[^\n \t"'()<>=*\/+-]+/},     // user-defined names
  {name: 'NL',      match: /\n/, lineBreaks: true },
  {name: 'ERROR',   error: true},
])

lexer.has = function(name) {
  return lexer.groups.find(g => g.tokenType === name)
}




function factory(decode, encode) {
  function process(d) {
    return decode.apply(undefined, d);
  }
  process.encode = encode
  return process
}

id.encode = function(x) { return [x] }

function literal(constant) {
  return factory(function decode() {
    return constant
  }, function encode(value) {
    if (value !== constant) { return false }
    return []
  })
}

function select(index) {
  return factory(function decode(...children) {
    return children[index]
  }, function encode(value) {
    var children = []
    children[index] = value
    return children
  })
}

function block(selector, ...rest) {
  return factory(function decode(...children) {
    var args = [selector]
    rest.forEach(childIndex => {
      args.push(children[childIndex])
    })
    return args
  }, function encode(array) {
    if (!array || array[0] !== selector) { return false }
    var children = [];
    rest.forEach((childIndex, argIndex) => {
      children[childIndex] = array[argIndex + 1]
    })
    return children
  })
}

function isNumber(x) {
  return typeof x === 'number' && (''+x) !== 'NaN'
}

var number = factory(function decodeNumber(...d) {
  var s = d[0].value //.join('')
  var n = parseInt(s)
  if (!isNaN(n)) return n
  var f = parseFloat(s)
  if (!isNaN(f)) return f
  return n
}, function encodeNumber(d) {
  if (isNumber(d)) {
    return '' + d
  }
  return false
})

var negateNumber = factory(function (a, _, n) {
  return -n
}, function (d) {
  if (isNumber(d) && d < 0) {
    return [ , , -d]
  }
  return false
})

var string = factory(function decodeString(...d) {
  return d[0].value
}, function encodeString(d) {
  if (typeof d === 'string') {
    return d
  }
  return false
})


/*
var join = factory(function decode(a) {
  return a.join('')
}, function encode(s) {
  return Array.from(s)
})
*/

var ignore = factory(a => null, _ => [])

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "line", "symbols": ["thing"], "postprocess": id},
    {"name": "thing", "symbols": ["block"], "postprocess": id},
    {"name": "thing", "symbols": ["r_parens"], "postprocess": id},
    {"name": "thing", "symbols": ["b_parens"], "postprocess": id},
    {"name": "n", "symbols": ["n4"], "postprocess": id},
    {"name": "sb", "symbols": ["join"], "postprocess": id},
    {"name": "sb", "symbols": ["n4"], "postprocess": id},
    {"name": "sb", "symbols": ["s0"], "postprocess": id},
    {"name": "b", "symbols": ["b8"], "postprocess": id},
    {"name": "c", "symbols": ["r_parens"], "postprocess": id},
    {"name": "c", "symbols": ["c0"], "postprocess": id},
    {"name": "r_parens", "symbols": [{"literal":"("}, "_", "r_value", "_", {"literal":")"}], "postprocess": select(2)},
    {"name": "r_value", "symbols": ["join"], "postprocess": id},
    {"name": "r_value", "symbols": ["n4"], "postprocess": id},
    {"name": "b_parens", "symbols": [{"literal":"<"}, "_", "b8", "_", {"literal":">"}], "postprocess": select(2)},
    {"name": "predicate", "symbols": ["simple_predicate"], "postprocess": id},
    {"name": "join", "symbols": [{"literal":"join"}, "__", "jpart", "__", "jpart"], "postprocess": block("concatenate:with:", 2, 4)},
    {"name": "jpart", "symbols": ["s0"], "postprocess": id},
    {"name": "jpart", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "jpart", "symbols": ["join"], "postprocess": id},
    {"name": "jpart", "symbols": ["r_parens"], "postprocess": id},
    {"name": "jpart", "symbols": ["b_parens"], "postprocess": id},
    {"name": "predicate", "symbols": [{"literal":"touching"}, "__", {"literal":"color"}, "__", "c", "_", {"literal":"?"}], "postprocess": block("touchingColor:", 4)},
    {"name": "predicate", "symbols": [{"literal":"color"}, "__", "c", "__", {"literal":"is"}, "__", {"literal":"touching"}, "__", "c", "_", {"literal":"?"}], "postprocess": block("color:sees:", 2, 8)},
    {"name": "b8", "symbols": ["b_and"], "postprocess": id},
    {"name": "b8", "symbols": ["b_or"], "postprocess": id},
    {"name": "b8", "symbols": ["b7"], "postprocess": id},
    {"name": "b_and", "symbols": ["b_and", "__", {"literal":"and"}, "__", "b7"], "postprocess": block("&", 0, 4)},
    {"name": "b_and", "symbols": ["b7", "__", {"literal":"and"}, "__", "b7"], "postprocess": block("&", 0, 4)},
    {"name": "b_or", "symbols": ["b_or", "__", {"literal":"or"}, "__", "b7"], "postprocess": block("|", 0, 4)},
    {"name": "b_or", "symbols": ["b7", "__", {"literal":"or"}, "__", "b7"], "postprocess": block("|", 0, 4)},
    {"name": "b7", "symbols": [{"literal":"not"}, "__", "b7"], "postprocess": block("not", 2)},
    {"name": "b7", "symbols": ["b6"], "postprocess": id},
    {"name": "b6", "symbols": ["sb", "__", {"literal":"<"}, "__", "sb"], "postprocess": block("<", 0, 4)},
    {"name": "b6", "symbols": ["sb", "__", {"literal":">"}, "__", "sb"], "postprocess": block(">", 0, 4)},
    {"name": "b6", "symbols": ["sb", "__", {"literal":"="}, "__", "sb"], "postprocess": block("=", 0, 4)},
    {"name": "b6", "symbols": ["m_list", "__", {"literal":"contains"}, "__", "sb", "_", {"literal":"?"}], "postprocess": block("list:contains:", 0, 4)},
    {"name": "b6", "symbols": ["predicate"], "postprocess": id},
    {"name": "b6", "symbols": ["b2"], "postprocess": id},
    {"name": "b2", "symbols": ["b_parens"], "postprocess": id},
    {"name": "b2", "symbols": ["b0"], "postprocess": id},
    {"name": "n4", "symbols": ["n4", "__", {"literal":"+"}, "__", "n3"], "postprocess": block("+", 0, 4)},
    {"name": "n4", "symbols": ["n4", "__", {"literal":"-"}, "__", "n3"], "postprocess": block("-", 0, 4)},
    {"name": "n4", "symbols": ["n3"], "postprocess": id},
    {"name": "n3", "symbols": ["n3", "__", {"literal":"*"}, "__", "n2"], "postprocess": block("*", 0, 4)},
    {"name": "n3", "symbols": ["n3", "__", {"literal":"/"}, "__", "n2"], "postprocess": block("/", 0, 4)},
    {"name": "n3", "symbols": ["n3", "__", {"literal":"mod"}, "__", "n2"], "postprocess": block("%", 0, 4)},
    {"name": "n3", "symbols": ["n2"], "postprocess": id},
    {"name": "n2", "symbols": [{"literal":"round"}, "__", "n2"], "postprocess": block("rounded", 2)},
    {"name": "n2", "symbols": ["m_mathOp", "__", {"literal":"of"}, "__", "n2"], "postprocess": block("computeFunction:of:", 0, 4)},
    {"name": "n2", "symbols": [{"literal":"pick"}, "__", {"literal":"random"}, "__", "n4", "__", {"literal":"to"}, "__", "n2"], "postprocess": block("randomFrom:to:", 4, 8)},
    {"name": "n2", "symbols": ["m_attribute", "__", {"literal":"of"}, "__", "m_spriteOrStage"], "postprocess": block("getAttribute:of:", 0, 4)},
    {"name": "n2", "symbols": [{"literal":"distance"}, "__", {"literal":"to"}, "__", "m_spriteOrMouse"], "postprocess": block("distanceTo:", 4)},
    {"name": "n2", "symbols": [{"literal":"length"}, "__", {"literal":"of"}, "__", "s2"], "postprocess": block("stringLength:", 4)},
    {"name": "n2", "symbols": [{"literal":"letter"}, "__", "n", "__", {"literal":"of"}, "__", "s2"], "postprocess": block("letter:of:", 2, 6)},
    {"name": "n2", "symbols": ["n1"], "postprocess": id},
    {"name": "n1", "symbols": ["simple_reporter"], "postprocess": id},
    {"name": "n1", "symbols": ["r_parens"], "postprocess": id},
    {"name": "n1", "symbols": ["b_parens"], "postprocess": id},
    {"name": "n1", "symbols": ["n0"], "postprocess": id},
    {"name": "s2", "symbols": ["s0"], "postprocess": id},
    {"name": "s2", "symbols": ["n1"], "postprocess": id},
    {"name": "n0", "symbols": [{"literal":"-"}, "_", "number"], "postprocess": negateNumber},
    {"name": "n0", "symbols": ["number"], "postprocess": id},
    {"name": "n0", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "s0", "symbols": ["string"], "postprocess": id},
    {"name": "b0", "symbols": [{"literal":"<>"}], "postprocess": literal(false)},
    {"name": "c0", "symbols": ["color"], "postprocess": id},
    {"name": "_greenFlag", "symbols": [{"literal":"flag"}]},
    {"name": "_greenFlag", "symbols": [{"literal":"green"}, "__", {"literal":"flag"}]},
    {"name": "_turnLeft", "symbols": [{"literal":"ccw"}]},
    {"name": "_turnLeft", "symbols": [{"literal":"left"}]},
    {"name": "_turnRight", "symbols": [{"literal":"cw"}]},
    {"name": "_turnRight", "symbols": [{"literal":"right"}]},
    {"name": "c0", "symbols": [{"literal":"red"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"orange"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"yellow"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"green"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"blue"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"purple"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"black"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"white"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"pink"}], "postprocess": id},
    {"name": "c0", "symbols": [{"literal":"brown"}], "postprocess": id},
    {"name": "m_attribute", "symbols": [{"literal":"x"}, "__", {"literal":"position"}], "postprocess": literal("x position")},
    {"name": "m_attribute", "symbols": [{"literal":"y"}, "__", {"literal":"position"}], "postprocess": literal("y position")},
    {"name": "m_attribute", "symbols": [{"literal":"direction"}], "postprocess": id},
    {"name": "m_attribute", "symbols": [{"literal":"costume"}, "__", {"literal":"#"}], "postprocess": literal("costume #")},
    {"name": "m_attribute", "symbols": [{"literal":"costume"}, "__", {"literal":"name"}], "postprocess": literal("costume name")},
    {"name": "m_attribute", "symbols": [{"literal":"backdrop"}, "__", {"literal":"#"}], "postprocess": literal("backdrop #")},
    {"name": "m_attribute", "symbols": [{"literal":"backdrop"}, "__", {"literal":"name"}], "postprocess": literal("backdrop name")},
    {"name": "m_attribute", "symbols": [{"literal":"size"}], "postprocess": id},
    {"name": "m_attribute", "symbols": [{"literal":"volume"}], "postprocess": id},
    {"name": "m_attribute", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_backdrop", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_backdrop", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_broadcast", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_broadcast", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_costume", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_costume", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_effect", "symbols": [{"literal":"color"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"fisheye"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"whirl"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"pixelate"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"mosaic"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"brightness"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"ghost"}], "postprocess": id},
    {"name": "m_effect", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_key", "symbols": [{"literal":"space"}], "postprocess": id},
    {"name": "m_key", "symbols": [{"literal":"up"}, "__", {"literal":"arrow"}], "postprocess": literal("up arrow")},
    {"name": "m_key", "symbols": [{"literal":"down"}, "__", {"literal":"arrow"}], "postprocess": literal("down arrow")},
    {"name": "m_key", "symbols": [{"literal":"right"}, "__", {"literal":"arrow"}], "postprocess": literal("right arrow")},
    {"name": "m_key", "symbols": [{"literal":"left"}, "__", {"literal":"arrow"}], "postprocess": literal("left arrow")},
    {"name": "m_key", "symbols": [{"literal":"any"}], "postprocess": id},
    {"name": "m_key", "symbols": [/[a-z0-9]/], "postprocess": id},
    {"name": "m_key", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_list", "symbols": ["ListName"], "postprocess": id},
    {"name": "m_list", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_location", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_location", "symbols": [{"literal":"mouse-pointer"}], "postprocess": literal("_mouse_")},
    {"name": "m_location", "symbols": [{"literal":"random"}, "__", {"literal":"position"}], "postprocess": literal("_random_")},
    {"name": "m_location", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_mathOp", "symbols": [{"literal":"abs"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"floor"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"ceiling"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"sqrt"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"sin"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"cos"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"tan"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"asin"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"acos"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"atan"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"ln"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"log"}], "postprocess": id},
    {"name": "m_mathOp", "symbols": [{"literal":"e"}, "_", {"literal":"^"}], "postprocess": literal("e ^")},
    {"name": "m_mathOp", "symbols": [{"literal":"10"}, "_", {"literal":"^"}], "postprocess": literal("10 ^")},
    {"name": "m_mathOp", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_rotationStyle", "symbols": [{"literal":"left-right"}], "postprocess": id},
    {"name": "m_rotationStyle", "symbols": [{"literal":"don't"}, "__", {"literal":"rotate"}], "postprocess": literal("don't rotate")},
    {"name": "m_rotationStyle", "symbols": [{"literal":"all"}, "__", {"literal":"around"}], "postprocess": literal("all around")},
    {"name": "m_rotationStyle", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_scene", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_scene", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_sound", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_sound", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_spriteOnly", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_spriteOnly", "symbols": [{"literal":"myself"}], "postprocess": literal("_myself_")},
    {"name": "m_spriteOnly", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_spriteOrMouse", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_spriteOrMouse", "symbols": [{"literal":"mouse-pointer"}], "postprocess": literal("_mouse_")},
    {"name": "m_spriteOrMouse", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_spriteOrStage", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_spriteOrStage", "symbols": [{"literal":"Stage"}], "postprocess": literal("_stage_")},
    {"name": "m_spriteOrStage", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_stageOrThis", "symbols": [{"literal":"Stage"}], "postprocess": literal("_stage_")},
    {"name": "m_stageOrThis", "symbols": [{"literal":"this"}, "__", {"literal":"sprite"}], "postprocess": literal("this sprite")},
    {"name": "m_stageOrThis", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_stop", "symbols": [{"literal":"all"}], "postprocess": id},
    {"name": "m_stop", "symbols": [{"literal":"this"}, "__", {"literal":"script"}], "postprocess": literal("this script")},
    {"name": "m_stop", "symbols": [{"literal":"other"}, "__", {"literal":"scripts"}, "__", {"literal":"in"}, "__", {"literal":"sprite"}], "postprocess": literal("other scripts in sprite")},
    {"name": "m_stop", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_timeAndDate", "symbols": [{"literal":"year"}], "postprocess": id},
    {"name": "m_timeAndDate", "symbols": [{"literal":"month"}], "postprocess": id},
    {"name": "m_timeAndDate", "symbols": [{"literal":"date"}], "postprocess": id},
    {"name": "m_timeAndDate", "symbols": [{"literal":"day"}, "__", {"literal":"of"}, "__", {"literal":"week"}], "postprocess": literal("day of week")},
    {"name": "m_timeAndDate", "symbols": [{"literal":"hour"}], "postprocess": id},
    {"name": "m_timeAndDate", "symbols": [{"literal":"minute"}], "postprocess": id},
    {"name": "m_timeAndDate", "symbols": [{"literal":"second"}], "postprocess": id},
    {"name": "m_timeAndDate", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_touching", "symbols": ["jpart"], "postprocess": id},
    {"name": "m_touching", "symbols": [{"literal":"mouse-pointer"}], "postprocess": literal("_mouse_")},
    {"name": "m_touching", "symbols": [{"literal":"edge"}], "postprocess": literal("_edge_")},
    {"name": "m_touching", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_triggerSensor", "symbols": [{"literal":"loudness"}], "postprocess": id},
    {"name": "m_triggerSensor", "symbols": [{"literal":"timer"}], "postprocess": id},
    {"name": "m_triggerSensor", "symbols": [{"literal":"video"}, "__", {"literal":"motion"}], "postprocess": literal("video motion")},
    {"name": "m_triggerSensor", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_var", "symbols": ["VariableName"], "postprocess": id},
    {"name": "m_var", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_varName", "symbols": ["VariableName"], "postprocess": id},
    {"name": "m_varName", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_videoMotionType", "symbols": [{"literal":"motion"}], "postprocess": id},
    {"name": "m_videoMotionType", "symbols": [{"literal":"direction"}], "postprocess": id},
    {"name": "m_videoMotionType", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "m_videoState", "symbols": [{"literal":"off"}], "postprocess": id},
    {"name": "m_videoState", "symbols": [{"literal":"on"}], "postprocess": id},
    {"name": "m_videoState", "symbols": [{"literal":"on-flipped"}], "postprocess": id},
    {"name": "m_videoState", "symbols": [{"literal":"_"}], "postprocess": literal("")},
    {"name": "d_direction", "symbols": ["n"], "postprocess": id},
    {"name": "d_drum", "symbols": ["n"], "postprocess": id},
    {"name": "d_instrument", "symbols": ["n"], "postprocess": id},
    {"name": "d_listDeleteItem", "symbols": [{"literal":"last"}], "postprocess": id},
    {"name": "d_listDeleteItem", "symbols": [{"literal":"all"}], "postprocess": id},
    {"name": "d_listDeleteItem", "symbols": ["n"], "postprocess": id},
    {"name": "d_listItem", "symbols": [{"literal":"last"}], "postprocess": id},
    {"name": "d_listItem", "symbols": [{"literal":"random"}], "postprocess": id},
    {"name": "d_listItem", "symbols": ["n"], "postprocess": id},
    {"name": "d_note", "symbols": ["n"], "postprocess": id},
    {"name": "m_attribute", "symbols": ["jpart"], "postprocess": id},
    {"name": "block", "symbols": [{"literal":"move"}, "__", "n", "__", {"literal":"steps"}], "postprocess": block("forward:", 2)},
    {"name": "block", "symbols": [{"literal":"turn"}, "__", "_turnRight", "__", "n", "__", {"literal":"degrees"}], "postprocess": block("turnRight:", 2, 4)},
    {"name": "block", "symbols": [{"literal":"turn"}, "__", "_turnLeft", "__", "n", "__", {"literal":"degrees"}], "postprocess": block("turnLeft:", 2, 4)},
    {"name": "block", "symbols": [{"literal":"point"}, "__", {"literal":"in"}, "__", {"literal":"direction"}, "__", "d_direction"], "postprocess": block("heading:", 6)},
    {"name": "block", "symbols": [{"literal":"point"}, "__", {"literal":"towards"}, "__", "m_spriteOrMouse"], "postprocess": block("pointTowards:", 4)},
    {"name": "block", "symbols": [{"literal":"go"}, "__", {"literal":"to"}, "__", {"literal":"x:"}, "__", "n", "__", {"literal":"y:"}, "__", "n"], "postprocess": block("gotoX:y:", 6, 10)},
    {"name": "block", "symbols": [{"literal":"go"}, "__", {"literal":"to"}, "__", "m_location"], "postprocess": block("gotoSpriteOrMouse:", 4)},
    {"name": "block", "symbols": [{"literal":"glide"}, "__", "n", "__", {"literal":"secs"}, "__", {"literal":"to"}, "__", {"literal":"x:"}, "__", "n", "__", {"literal":"y:"}, "__", "n"], "postprocess": block("glideSecs:toX:y:elapsed:from:", 2, 10, 14)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"x"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeXposBy:", 6)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"x"}, "__", {"literal":"to"}, "__", "n"], "postprocess": block("xpos:", 6)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"y"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeYposBy:", 6)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"y"}, "__", {"literal":"to"}, "__", "n"], "postprocess": block("ypos:", 6)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"rotation"}, "__", {"literal":"style"}, "__", "m_rotationStyle"], "postprocess": block("setRotationStyle", 6)},
    {"name": "block", "symbols": [{"literal":"say"}, "__", "sb", "__", {"literal":"for"}, "__", "n", "__", {"literal":"secs"}], "postprocess": block("say:duration:elapsed:from:", 2, 6)},
    {"name": "block", "symbols": [{"literal":"say"}, "__", "sb"], "postprocess": block("say:", 2)},
    {"name": "block", "symbols": [{"literal":"think"}, "__", "sb", "__", {"literal":"for"}, "__", "n", "__", {"literal":"secs"}], "postprocess": block("think:duration:elapsed:from:", 2, 6)},
    {"name": "block", "symbols": [{"literal":"think"}, "__", "sb"], "postprocess": block("think:", 2)},
    {"name": "block", "symbols": [{"literal":"show"}], "postprocess": block("show")},
    {"name": "block", "symbols": [{"literal":"hide"}], "postprocess": block("hide")},
    {"name": "block", "symbols": [{"literal":"switch"}, "__", {"literal":"costume"}, "__", {"literal":"to"}, "__", "m_costume"], "postprocess": block("lookLike:", 6)},
    {"name": "block", "symbols": [{"literal":"next"}, "__", {"literal":"costume"}], "postprocess": block("nextCostume")},
    {"name": "block", "symbols": [{"literal":"next"}, "__", {"literal":"backdrop"}], "postprocess": block("nextScene")},
    {"name": "block", "symbols": [{"literal":"switch"}, "__", {"literal":"backdrop"}, "__", {"literal":"to"}, "__", "m_backdrop"], "postprocess": block("startScene", 6)},
    {"name": "block", "symbols": [{"literal":"switch"}, "__", {"literal":"backdrop"}, "__", {"literal":"to"}, "__", "m_backdrop", "__", {"literal":"and"}, "__", {"literal":"wait"}], "postprocess": block("startSceneAndWait", 6)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", "m_effect", "__", {"literal":"effect"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeGraphicEffect:by:", 2, 8)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", "m_effect", "__", {"literal":"effect"}, "__", {"literal":"to"}, "__", "n"], "postprocess": block("setGraphicEffect:to:", 2, 8)},
    {"name": "block", "symbols": [{"literal":"clear"}, "__", {"literal":"graphic"}, "__", {"literal":"effects"}], "postprocess": block("filterReset")},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"size"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeSizeBy:", 6)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"size"}, "__", {"literal":"to"}, "__", "n", "__", {"literal":"%"}], "postprocess": block("setSizeTo:", 6)},
    {"name": "block", "symbols": [{"literal":"go"}, "__", {"literal":"to"}, "__", {"literal":"front"}], "postprocess": block("comeToFront")},
    {"name": "block", "symbols": [{"literal":"go"}, "__", {"literal":"back"}, "__", "n", "__", {"literal":"layers"}], "postprocess": block("goBackByLayers:", 4)},
    {"name": "block", "symbols": [{"literal":"play"}, "__", {"literal":"sound"}, "__", "m_sound"], "postprocess": block("playSound:", 4)},
    {"name": "block", "symbols": [{"literal":"play"}, "__", {"literal":"sound"}, "__", "m_sound", "__", {"literal":"until"}, "__", {"literal":"done"}], "postprocess": block("doPlaySoundAndWait", 4)},
    {"name": "block", "symbols": [{"literal":"stop"}, "__", {"literal":"all"}, "__", {"literal":"sounds"}], "postprocess": block("stopAllSounds")},
    {"name": "block", "symbols": [{"literal":"play"}, "__", {"literal":"drum"}, "__", "d_drum", "__", {"literal":"for"}, "__", "n", "__", {"literal":"beats"}], "postprocess": block("playDrum", 4, 8)},
    {"name": "block", "symbols": [{"literal":"rest"}, "__", {"literal":"for"}, "__", "n", "__", {"literal":"beats"}], "postprocess": block("rest:elapsed:from:", 4)},
    {"name": "block", "symbols": [{"literal":"play"}, "__", {"literal":"note"}, "__", "d_note", "__", {"literal":"for"}, "__", "n", "__", {"literal":"beats"}], "postprocess": block("noteOn:duration:elapsed:from:", 4, 8)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"instrument"}, "__", {"literal":"to"}, "__", "d_instrument"], "postprocess": block("instrument:", 6)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"volume"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeVolumeBy:", 6)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"volume"}, "__", {"literal":"to"}, "__", "n", "__", {"literal":"%"}], "postprocess": block("setVolumeTo:", 6)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"tempo"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeTempoBy:", 6)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"tempo"}, "__", {"literal":"to"}, "__", "n", "__", {"literal":"bpm"}], "postprocess": block("setTempoTo:", 6)},
    {"name": "block", "symbols": [{"literal":"clear"}], "postprocess": block("clearPenTrails")},
    {"name": "block", "symbols": [{"literal":"stamp"}], "postprocess": block("stampCostume")},
    {"name": "block", "symbols": [{"literal":"pen"}, "__", {"literal":"down"}], "postprocess": block("putPenDown")},
    {"name": "block", "symbols": [{"literal":"pen"}, "__", {"literal":"up"}], "postprocess": block("putPenUp")},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"pen"}, "__", {"literal":"color"}, "__", {"literal":"to"}, "__", "c"], "postprocess": block("penColor:", 8)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"pen"}, "__", {"literal":"hue"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changePenHueBy:", 8)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"pen"}, "__", {"literal":"hue"}, "__", {"literal":"to"}, "__", "n"], "postprocess": block("setPenHueTo:", 8)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"pen"}, "__", {"literal":"shade"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changePenShadeBy:", 8)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"pen"}, "__", {"literal":"shade"}, "__", {"literal":"to"}, "__", "n"], "postprocess": block("setPenShadeTo:", 8)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", {"literal":"pen"}, "__", {"literal":"size"}, "__", {"literal":"by"}, "__", "n"], "postprocess": block("changePenSizeBy:", 8)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"pen"}, "__", {"literal":"size"}, "__", {"literal":"to"}, "__", "n"], "postprocess": block("penSize:", 8)},
    {"name": "block", "symbols": [{"literal":"when"}, "__", "_greenFlag", "__", {"literal":"clicked"}], "postprocess": block("whenGreenFlag", 2)},
    {"name": "block", "symbols": [{"literal":"when"}, "__", "m_key", "__", {"literal":"key"}, "__", {"literal":"pressed"}], "postprocess": block("whenKeyPressed", 2)},
    {"name": "block", "symbols": [{"literal":"when"}, "__", {"literal":"this"}, "__", {"literal":"sprite"}, "__", {"literal":"clicked"}], "postprocess": block("whenClicked")},
    {"name": "block", "symbols": [{"literal":"when"}, "__", {"literal":"backdrop"}, "__", {"literal":"switches"}, "__", {"literal":"to"}, "__", "m_backdrop"], "postprocess": block("whenSceneStarts", 8)},
    {"name": "block", "symbols": [{"literal":"when"}, "__", "m_triggerSensor", "__", {"literal":">"}, "__", "n"], "postprocess": block("whenSensorGreaterThan", 2, 6)},
    {"name": "block", "symbols": [{"literal":"when"}, "__", {"literal":"I"}, "__", {"literal":"receive"}, "__", "m_broadcast"], "postprocess": block("whenIReceive", 6)},
    {"name": "block", "symbols": [{"literal":"broadcast"}, "__", "m_broadcast"], "postprocess": block("broadcast:", 2)},
    {"name": "block", "symbols": [{"literal":"broadcast"}, "__", "m_broadcast", "__", {"literal":"and"}, "__", {"literal":"wait"}], "postprocess": block("doBroadcastAndWait", 2)},
    {"name": "block", "symbols": [{"literal":"wait"}, "__", "n", "__", {"literal":"secs"}], "postprocess": block("wait:elapsed:from:", 2)},
    {"name": "block", "symbols": [{"literal":"repeat"}, "__", "n"], "postprocess": block("doRepeat", 2)},
    {"name": "block", "symbols": [{"literal":"forever"}], "postprocess": block("doForever")},
    {"name": "block", "symbols": [{"literal":"if"}, "__", "b", "__", {"literal":"then"}], "postprocess": block("doIfElse", 2)},
    {"name": "block", "symbols": [{"literal":"wait"}, "__", {"literal":"until"}, "__", "b"], "postprocess": block("doWaitUntil", 4)},
    {"name": "block", "symbols": [{"literal":"repeat"}, "__", {"literal":"until"}, "__", "b"], "postprocess": block("doUntil", 4)},
    {"name": "block", "symbols": [{"literal":"stop"}, "__", "m_stop"], "postprocess": block("stopScripts", 2)},
    {"name": "block", "symbols": [{"literal":"when"}, "__", {"literal":"I"}, "__", {"literal":"start"}, "__", {"literal":"as"}, "__", {"literal":"a"}, "__", {"literal":"clone"}], "postprocess": block("whenCloned")},
    {"name": "block", "symbols": [{"literal":"create"}, "__", {"literal":"clone"}, "__", {"literal":"of"}, "__", "m_spriteOnly"], "postprocess": block("createCloneOf", 6)},
    {"name": "block", "symbols": [{"literal":"delete"}, "__", {"literal":"this"}, "__", {"literal":"clone"}], "postprocess": block("deleteClone")},
    {"name": "block", "symbols": [{"literal":"ask"}, "__", "sb", "__", {"literal":"and"}, "__", {"literal":"wait"}], "postprocess": block("doAsk", 2)},
    {"name": "block", "symbols": [{"literal":"turn"}, "__", {"literal":"video"}, "__", "m_videoState"], "postprocess": block("setVideoState", 4)},
    {"name": "block", "symbols": [{"literal":"set"}, "__", {"literal":"video"}, "__", {"literal":"transparency"}, "__", {"literal":"to"}, "__", "n", "__", {"literal":"%"}], "postprocess": block("setVideoTransparency", 8)},
    {"name": "block", "symbols": [{"literal":"reset"}, "__", {"literal":"timer"}], "postprocess": block("timerReset")},
    {"name": "block", "symbols": [{"literal":"set"}, "__", "m_var", "__", {"literal":"to"}, "__", "sb"], "postprocess": block("setVar:to:", 2, 6)},
    {"name": "block", "symbols": [{"literal":"change"}, "__", "m_var", "__", {"literal":"by"}, "__", "n"], "postprocess": block("changeVar:by:", 2, 6)},
    {"name": "block", "symbols": [{"literal":"show"}, "__", {"literal":"variable"}, "__", "m_var"], "postprocess": block("showVariable:", 4)},
    {"name": "block", "symbols": [{"literal":"hide"}, "__", {"literal":"variable"}, "__", "m_var"], "postprocess": block("hideVariable:", 4)},
    {"name": "block", "symbols": [{"literal":"add"}, "__", "sb", "__", {"literal":"to"}, "__", "m_list"], "postprocess": block("append:toList:", 2, 6)},
    {"name": "block", "symbols": [{"literal":"delete"}, "__", "d_listDeleteItem", "__", {"literal":"of"}, "__", "m_list"], "postprocess": block("deleteLine:ofList:", 2, 6)},
    {"name": "block", "symbols": [{"literal":"if"}, "__", {"literal":"on"}, "__", {"literal":"edge,"}, "__", {"literal":"bounce"}], "postprocess": block("bounceOffEdge")},
    {"name": "block", "symbols": [{"literal":"insert"}, "__", "sb", "__", {"literal":"at"}, "__", "d_listItem", "__", {"literal":"of"}, "__", "m_list"], "postprocess": block("insert:at:ofList:", 2, 6, 10)},
    {"name": "block", "symbols": [{"literal":"replace"}, "__", {"literal":"item"}, "__", "d_listItem", "__", {"literal":"of"}, "__", "m_list", "__", {"literal":"with"}, "__", "sb"], "postprocess": block("setLine:ofList:to:", 4, 8, 12)},
    {"name": "block", "symbols": [{"literal":"show"}, "__", {"literal":"list"}, "__", "m_list"], "postprocess": block("showList:", 4)},
    {"name": "block", "symbols": [{"literal":"hide"}, "__", {"literal":"list"}, "__", "m_list"], "postprocess": block("hideList:", 4)},
    {"name": "simple_reporter", "symbols": [{"literal":"x"}, "__", {"literal":"position"}], "postprocess": block("xpos")},
    {"name": "simple_reporter", "symbols": [{"literal":"y"}, "__", {"literal":"position"}], "postprocess": block("ypos")},
    {"name": "simple_reporter", "symbols": [{"literal":"direction"}], "postprocess": block("heading")},
    {"name": "simple_reporter", "symbols": [{"literal":"costume"}, "__", {"literal":"#"}], "postprocess": block("costumeIndex")},
    {"name": "simple_reporter", "symbols": [{"literal":"size"}], "postprocess": block("scale")},
    {"name": "simple_reporter", "symbols": [{"literal":"backdrop"}, "__", {"literal":"name"}], "postprocess": block("sceneName")},
    {"name": "simple_reporter", "symbols": [{"literal":"backdrop"}, "__", {"literal":"#"}], "postprocess": block("backgroundIndex")},
    {"name": "simple_reporter", "symbols": [{"literal":"volume"}], "postprocess": block("volume")},
    {"name": "simple_reporter", "symbols": [{"literal":"tempo"}], "postprocess": block("tempo")},
    {"name": "simple_predicate", "symbols": [{"literal":"touching"}, "__", "m_touching", "_", {"literal":"?"}], "postprocess": block("touching:", 2)},
    {"name": "simple_reporter", "symbols": [{"literal":"answer"}], "postprocess": block("answer")},
    {"name": "simple_predicate", "symbols": [{"literal":"key"}, "__", "m_key", "__", {"literal":"pressed"}, "_", {"literal":"?"}], "postprocess": block("keyPressed:", 2)},
    {"name": "simple_predicate", "symbols": [{"literal":"mouse"}, "__", {"literal":"down"}, "_", {"literal":"?"}], "postprocess": block("mousePressed")},
    {"name": "simple_reporter", "symbols": [{"literal":"mouse"}, "__", {"literal":"x"}], "postprocess": block("mouseX")},
    {"name": "simple_reporter", "symbols": [{"literal":"mouse"}, "__", {"literal":"y"}], "postprocess": block("mouseY")},
    {"name": "simple_reporter", "symbols": [{"literal":"loudness"}], "postprocess": block("soundLevel")},
    {"name": "simple_reporter", "symbols": [{"literal":"video"}, "__", "m_videoMotionType", "__", {"literal":"on"}, "__", "m_stageOrThis"], "postprocess": block("senseVideoMotion", 2, 6)},
    {"name": "simple_reporter", "symbols": [{"literal":"timer"}], "postprocess": block("timer")},
    {"name": "simple_reporter", "symbols": [{"literal":"current"}, "__", "m_timeAndDate"], "postprocess": block("timeAndDate", 2)},
    {"name": "simple_reporter", "symbols": [{"literal":"days"}, "__", {"literal":"since"}, "__", {"literal":"2000"}], "postprocess": block("timestamp", 4)},
    {"name": "simple_reporter", "symbols": [{"literal":"username"}], "postprocess": block("getUserName")},
    {"name": "simple_reporter", "symbols": [{"literal":"item"}, "__", "d_listItem", "__", {"literal":"of"}, "__", "m_list"], "postprocess": block("getLine:ofList:", 2, 6)},
    {"name": "simple_reporter", "symbols": [{"literal":"length"}, "__", {"literal":"of"}, "__", "m_list"], "postprocess": block("lineCountOfList:", 4)},
    {"name": "simple_reporter", "symbols": ["VariableName"], "postprocess": block("readVariable", 0)},
    {"name": "block", "symbols": [{"literal":"else"}], "postprocess": block("else")},
    {"name": "block", "symbols": [{"literal":"end"}], "postprocess": block("end")},
    {"name": "block", "symbols": [{"literal":"..."}], "postprocess": block("ellips")},
    {"name": "_", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_", "symbols": [], "postprocess": ignore},
    {"name": "__", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": ignore},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": string},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": number},
    {"name": "color", "symbols": [(lexer.has("color") ? {type: "color"} : color)]},
    {"name": "VariableName", "symbols": [{"literal":"foo"}], "postprocess": literal('foo')},
    {"name": "VariableName", "symbols": [{"literal":"PixelX"}], "postprocess": literal('PixelX')},
    {"name": "ListName", "symbols": [{"literal":"list"}], "postprocess": literal('list')}
]
  , ParserStart: "line"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
