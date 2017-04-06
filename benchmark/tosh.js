/* This file is (C) Copyright Tim Radvan, 2017.
 * All rights reserved
 */

var Scratch = (function() {

  var scratchCommands = [

    ["move %n steps",						" ", 1, "forward:",					10],
    ["turn @turnRight %n degrees",			" ", 1, "turnRight:",				15],
    ["turn @turnLeft %n degrees",			" ", 1, "turnLeft:",				15],
    ["point in direction %d.direction",		" ", 1, "heading:",					90],
    ["point towards %m.spriteOrMouse",		" ", 1, "pointTowards:",			""],
    ["go to x:%n y:%n",						" ", 1, "gotoX:y:"],
    ["go to %m.location",					" ", 1, "gotoSpriteOrMouse:",		"mouse-pointer"],
    ["glide %n secs to x:%n y:%n",			" ", 1, "glideSecs:toX:y:elapsed:from:"],
    ["change x by %n",						" ", 1, "changeXposBy:",			10],
    ["set x to %n",							" ", 1, "xpos:",					0],
    ["change y by %n",						" ", 1, "changeYposBy:",			10],
    ["set y to %n",							" ", 1, "ypos:",					0],
    ["set rotation style %m.rotationStyle",	" ", 1, "setRotationStyle", 		"left-right"],
    ["say %s for %n secs",					" ", 2, "say:duration:elapsed:from:",	"Hello!", 2],
    ["say %s",								" ", 2, "say:",							"Hello!"],
    ["think %s for %n secs",				" ", 2, "think:duration:elapsed:from:", "Hmm...", 2],
    ["think %s",							" ", 2, "think:",						"Hmm..."],
    ["show",								" ", 2, "show"],
    ["hide",								" ", 2, "hide"],
    ["switch costume to %m.costume",		" ", 2, "lookLike:",				"costume1"],
    ["next costume",						" ", 2, "nextCostume"],
    ["next backdrop",						" ", 102, "nextScene"],
    ["switch backdrop to %m.backdrop",		" ", 2, "startScene", 				"backdrop1"],
    ["switch backdrop to %m.backdrop and wait", " ", 102, "startSceneAndWait",		"backdrop1"],
    ["change %m.effect effect by %n",		" ", 2, "changeGraphicEffect:by:",	"color", 25],
    ["set %m.effect effect to %n",			" ", 2, "setGraphicEffect:to:",		"color", 0],
    ["clear graphic effects",				" ", 2, "filterReset"],
    ["change size by %n",					" ", 2, "changeSizeBy:",	 		10],
    ["set size to %n%",						" ", 2, "setSizeTo:", 				100],
    ["go to front",							" ", 2, "comeToFront"],
    ["go back %n layers",					" ", 2, "goBackByLayers:", 			1],
    ["play sound %m.sound",					" ", 3, "playSound:",						"pop"],
    ["play sound %m.sound until done",		" ", 3, "doPlaySoundAndWait",				"pop"],
    ["stop all sounds",						" ", 3, "stopAllSounds"],
    ["play drum %d.drum for %n beats",		" ", 3, "playDrum",							1, 0.25],
    ["rest for %n beats",					" ", 3, "rest:elapsed:from:",				0.25],
    ["play note %d.note for %n beats",		" ", 3, "noteOn:duration:elapsed:from:",	60, 0.5],
    ["set instrument to %d.instrument",		" ", 3, "instrument:",						1],
    ["change volume by %n",					" ", 3, "changeVolumeBy:",					-10],
    ["set volume to %n%",					" ", 3, "setVolumeTo:", 					100],
    ["change tempo by %n",					" ", 3, "changeTempoBy:",					20],
    ["set tempo to %n bpm",					" ", 3, "setTempoTo:",						60],
    ["clear",								" ", 4, "clearPenTrails"],
    ["stamp",								" ", 4, "stampCostume"],
    ["pen down",							" ", 4, "putPenDown"],
    ["pen up",								" ", 4, "putPenUp"],
    ["set pen color to %c",					" ", 4, "penColor:"],
    ["change pen color by %n",				" ", 4, "changePenHueBy:"],
    ["set pen color to %n",					" ", 4, "setPenHueTo:", 		0],
    ["change pen shade by %n",				" ", 4, "changePenShadeBy:"],
    ["set pen shade to %n",					" ", 4, "setPenShadeTo:",		50],
    ["change pen size by %n",				" ", 4, "changePenSizeBy:",		1],
    ["set pen size to %n",					" ", 4, "penSize:", 			1],
    ["when @greenFlag clicked",				"h", 5, "whenGreenFlag"],
    ["when %m.key key pressed",				"h", 5, "whenKeyPressed", 		"space"],
    ["when this sprite clicked",			"h", 5, "whenClicked"],
    ["when backdrop switches to %m.backdrop", "h", 5, "whenSceneStarts", 	"backdrop1"],
    ["when %m.triggerSensor > %n",			"h", 5, "whenSensorGreaterThan", "loudness", 10],
    ["when I receive %m.broadcast",			"h", 5, "whenIReceive",			""],
    ["broadcast %m.broadcast",				" ", 5, "broadcast:",			""],
    ["broadcast %m.broadcast and wait",		" ", 5, "doBroadcastAndWait",	""],
    ["wait %n secs",						" ", 6, "wait:elapsed:from:",	1],
    ["repeat %n",							"c", 6, "doRepeat", 10],
    ["forever",								"cf",6, "doForever"],
    ["if %b then",							"c", 6, "doIf"],
    ["if %b then",							"e", 6, "doIfElse"],
    ["wait until %b",						" ", 6, "doWaitUntil"],
    ["repeat until %b",						"c", 6, "doUntil"],
    ["stop %m.stop",						"f", 6, "stopScripts", "all"],
    ["when I start as a clone",				"h", 6, "whenCloned"],
    ["create clone of %m.spriteOnly",		" ", 6, "createCloneOf"],
    ["delete this clone",					"f", 6, "deleteClone"],
    ["ask %s and wait",						" ", 7, "doAsk", 				"What's your name?"],
    ["turn video %m.videoState",			" ", 7, "setVideoState",			"on"],
    ["set video transparency to %n%",		" ", 7, "setVideoTransparency",		50],
    ["reset timer",							" ", 7, "timerReset"],
    ["set %m.var to %s",								" ", 9, "setVar:to:"],
    ["change %m.var by %n",								" ", 9, "changeVar:by:"],
    ["show variable %m.var",							" ", 9, "showVariable:"],
    ["hide variable %m.var",							" ", 9, "hideVariable:"],
    ["add %s to %m.list",								" ", 12, "append:toList:"],
    ["delete %d.listDeleteItem of %m.list",				" ", 12, "deleteLine:ofList:"],
    ["if on edge, bounce",					" ", 1, "bounceOffEdge"],
    ["insert %s at %d.listItem of %m.list",				" ", 12, "insert:at:ofList:"],
    ["replace item %d.listItem of %m.list with %s",		" ", 12, "setLine:ofList:to:"],
    ["show list %m.list",								" ", 12, "showList:"],
    ["hide list %m.list",								" ", 12, "hideList:"],

    ["x position",							"r", 1, "xpos"],
    ["y position",							"r", 1, "ypos"],
    ["direction",							"r", 1, "heading"],
    ["costume #",							"r", 2, "costumeIndex"],
    ["size",								"r", 2, "scale"],
    ["backdrop name",						"r", 102, "sceneName"],
    ["backdrop #",							"r", 102, "backgroundIndex"],
    ["volume",								"r", 3, "volume"],
    ["tempo",								"r", 3,  "tempo"],
    ["touching %m.touching?",				"b", 7, "touching:",			""],
    ["touching color %c?",					"b", 7, "touchingColor:"],
    ["color %c is touching %c?",			"b", 7, "color:sees:"],
    ["distance to %m.spriteOrMouse",		"r", 7, "distanceTo:",			""],
    ["answer",								"r", 7, "answer"],
    ["key %m.key pressed?",					"b", 7, "keyPressed:",			"space"],
    ["mouse down?",							"b", 7, "mousePressed"],
    ["mouse x",								"r", 7, "mouseX"],
    ["mouse y",								"r", 7, "mouseY"],
    ["loudness",							"r", 7, "soundLevel"],
    ["video %m.videoMotionType on %m.stageOrThis", "r", 7, "senseVideoMotion", "motion"],
    ["timer",								"r", 7, "timer"],
    ["%m.attribute of %m.spriteOrStage",	"r", 7, "getAttribute:of:"],
    ["current %m.timeAndDate", 				"r", 7, "timeAndDate",			"minute"],
    ["days since 2000", 					"r", 7, "timestamp"],
    ["username",							"r", 7, "getUserName"],
    ["%n + %n",								"r", 8, "+",					"", ""],
    ["%n - %n",								"r", 8, "-",					"", ""],
    ["%n * %n",								"r", 8, "*",					"", ""],
    ["%n / %n",								"r", 8, "/",					"", ""],
    ["pick random %n to %n",		"r", 8, "randomFrom:to:",		1, 10],
    ["%s < %s",								"b", 8, "<",					"", ""],
    ["%s = %s",								"b", 8, "=",					"", ""],
    ["%s > %s",								"b", 8, ">",					"", ""],
    ["%b and %b",							"b", 8, "&"],
    ["%b or %b",							"b", 8, "|"],
    ["not %b",								"b", 8, "not"],
    ["join %s %s",							"r", 8, "concatenate:with:",	"hello ", "world"],
    ["letter %n of %s",						"r", 8, "letter:of:",			1, "world"],
    ["length of %s",						"r", 8, "stringLength:",		"world"],
    ["%n mod %n",							"r", 8, "%",					"", ""],
    ["round %n",							"r", 8, "rounded", 				""],
    ["%m.mathOp of %n",						"r", 8, "computeFunction:of:",	"sqrt", 9],
    ["item %d.listItem of %m.list",						"r", 12, "getLine:ofList:"],
    ["length of %m.list",								"r", 12, "lineCountOfList:"],
    ["%m.list contains %s?",								"b", 12, "list:contains:"],

  ];



  /* define Scratch blocks */

  var categoriesById = {
    1:  "motion",
    2:  "looks",
    3:  "sound",
    4:  "pen",
    5:  "events",
    6:  "control",
    7:  "sensing",
    8:  "operators",
    9:  "variable",
    10: "custom",
    11: "parameter",
    12: "list",
    20: "extension",
    42: "grey",
  };

  var blocks = [];
  var blocksBySelector = {};

  var inputPat = /(%[a-zA-Z](?:\.[a-zA-Z]+)?)/g;

  scratchCommands.push(["%m.var", "r", 9, "readVariable"]);
  scratchCommands.push(["%m.list", "r", 12, "contentsOfList:"]);
  scratchCommands.push(["%m.param", "r", 11, "getParam"]);
  scratchCommands.push(["%m.param", "b", 11, "getParam"]);
  scratchCommands.push(["else", "else", 6, "else"]);
  scratchCommands.push(["end", "end", 6, "end"]);
  scratchCommands.push(["...", "ellips", 42, "ellips"]);

  var typeShapes = {
    ' ': 'stack',
    'b': 'predicate',
    'c': 'c-block',
    'e': 'if-block',
    'f': 'cap',
    'h': 'hat',
    'r': 'reporter',
    'cf': 'c-block cap',

    'else': 'else',
    'end': 'end',
    'ellips': 'ellips',
  };

  scratchCommands.forEach(function(command) {
    var spec = command[0];
    if (spec === 'set pen color to %n') {
      spec = 'set pen hue to %n';
    } else if (spec === 'change pen color by %n') {
      spec = 'change pen hue by %n';
    }
    var block = {
      spec: spec,
      parts: spec.split(inputPat),
      shape: typeShapes[command[1]], // /[ bcefhr]|cf/
      category: categoriesById[command[2] % 100],
      selector: command[3],
      defaults: command.slice(4),
    };
    block.inputs = block.parts.filter(function(p) { return inputPat.test(p); });
    blocks.push(block);
    //if (block.selector !== 'getParam') assert(!blocksBySelector[block.selector], block.selector);
    blocksBySelector[block.selector] = block;
  });

  /* this keeps format.js happy */

  var inputShapes = {
    '%b': 'boolean',
    '%c': 'color',
    '%d': 'number-menu',
    '%m': 'readonly-menu',
    '%n': 'number',
    '%s': 'string',
  }

  var getInputShape = function(input) {
    var s = input.slice(0, 2)
    return inputShapes[s];
  };

  /* alternative info for stop block */

  var osisInfo = {
    category: "control",
    defaults: ["all"],
    inputs: ["%m.stop"],
    parts: ["stop", "%m.stop", ""],
    selector: "stopScripts",
    shape: "stack",
    spec: "stop %m.stop",
  };


  return {
    blocks: blocks,
    blocksBySelector: blocksBySelector,
    inputPat: inputPat,
    getInputShape: getInputShape,

    stopOtherScripts: osisInfo,
  };

}());

var Language = (function() {
 

  /* For Compiler.generate() */

  var precedenceLevels = [
    // custom block args = -2
    // join = -1
    [], // zero
    ['*', '/', '%'],
    ['+', '-'],
    ['=', '<', '>', 'list:contains:'],
    ['not'],
    ['&',],  // actually & and | have the same precedence!
    ['|',],  // except they must be parenthesised when inside each other.
    // [ stack blocks ]
  ];

  var precedence = {};
  precedenceLevels.forEach(function(list, index) {
    list.forEach(function(selector) {
      precedence[selector] = index;
    });
  });

  // special-case "join"
  precedence['concatenate:with:'] = -1;


 
  var menusThatAcceptReporters = ['broadcast', 'costume', 'backdrop',
      'location', 'scene', 'sound', 'spriteOnly', 'spriteOrMouse',
      'spriteOrStage', 'touching'];

  var menuOptions = {
    'attribute': ['x position', 'y position', 'direction', 'costume #', 'costume name', 'backdrop #', 'backdrop name', 'size', 'volume'],
    'backdrop': [],
    'booleanSensor': ['button pressed', 'A connected', 'B connected',
    'C connected', 'D connected'],
    'broadcast': [],
    'costume': [],
    'effect': ['color', 'fisheye', 'whirl', 'pixelate', 'mosaic',
    'brightness', 'ghost'],
    'key': ['space', 'up arrow', 'down arrow', 'right arrow', 'left arrow',
      'any', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2,
      3, 4, 5, 6, 7, 8, 9],
    'list': [],
    'listDeleteItem': ['last', 'all'],
    'listItem': ['last', 'random'],
    'location': ['mouse-pointer', 'random position'],
    'mathOp': ['abs', 'floor', 'ceiling', 'sqrt', 'sin', 'cos', 'tan',
    'asin', 'acos', 'atan', 'ln', 'log', 'e ^', '10 ^'],
    'motorDirection': ['this way', 'that way', 'reverse'],
    'rotationStyle': ['left-right', "don't rotate", 'all around'],
    'sensor': ['slider', 'light', 'sound', 'resistance-A', 'resistance-B',
    'resistance-C', 'resistance-D'],
    'sound': [],
    'spriteOnly': ['myself'],
    'spriteOrMouse': ['mouse-pointer'],
    'spriteOrStage': ['Stage'],
    'stageOrThis': ['Stage', 'this sprite'],
    'stop': ['all', 'this script', 'other scripts in sprite'],
    'timeAndDate': ['year', 'month', 'date', 'day of week', 'hour',
    'minute', 'second'],
    'touching': ['mouse-pointer', 'edge'],
    'triggerSensor': ['loudness', 'timer', 'video motion'],
    'var': [],
    'videoMotionType': ['motion', 'direction'],
    'videoState': ['off', 'on', 'on-flipped'],
  };

  // only generate number literals for some blocks
  var blocksWithNumberLiterals = [
    'setVar:to:',
    '<', '>', '=',
  ];
  // force string literals for:
  //  'concatenate:with:',
  //  'append:toList:',
  //  'insert:at:ofList:',
  //  say
  //  think
  //  ask
  //  letter:of:
  //  stringLength:
  //  list:contains:
  // ]


  return {
    // for Compiler
    precedence: precedence,
    menusThatAcceptReporters: menusThatAcceptReporters,
    menuOptions: menuOptions,
    blocksWithNumberLiterals: blocksWithNumberLiterals,
  }

}());


  /* generate: AST -> tosh */

  var images = {
    '@greenFlag': 'flag',
    '@turnLeft': 'ccw',
    '@turnRight': 'cw',
  };

  function generate(scripts) {
    var scriptText = [];
    for (var i=0; i<scripts.length; i++) {
      var blocks = scripts[i][2];

      // standalone reporter?
      if (blocks.length === 1) {
        // TODO preference to skip all standalone reporters

        // if it contains a parameter -> not valid!
        if (containsParameter(blocks[0])) continue;
      }

      scriptText.push(generateList(blocks).join('\n'));
    }
    var result = scriptText.join('\n\n');

    // enforce trailing blank line
    if (result && result[result.length - 1] !== '\n') result += '\n';
    return result;
  }

  function containsParameter(reporter) {
    if (reporter[0] === 'getParam') return true;
    for (var i=1; i<reporter.length; i++) {
      var arg = reporter[i];
      if (arg.constructor === Array && containsParameter(arg)) {
        return true;
      }
    }
    return false;
  }

  function generateList(list) {
    var lines = [];
    list.forEach(function(block) {
      lines = lines.concat(generateBlock(block));
    });
    return lines;
  }

  function generateBlock(block) {
    var selector = block[0],
        args = block.slice(1),
        info = Scratch.blocksBySelector[selector];

    if (selector === 'call') {
      var spec = selector = args.shift();
      info = {
        spec: spec,
        parts: spec.split(Scratch.inputPat),
        shape: 'stack',
        category: 'custom',
        selector: null,
        defaults: [], // don't need these
        _isCustom: true,
      };
      info.inputs = info.parts.filter(function(p) { return Scratch.inputPat.test(p); });
    } else if (selector === 'procDef') {
      var spec = block[1],
          names = block[2].slice(),
          defaults = block[3].slice(), // ignore these
          isAtomic = block[4];
      var result = isAtomic ? 'define-atomic ' : 'define ';
      return result + spec.split(Scratch.inputPat).map(function(part) {
        var m = Scratch.inputPat.exec(part);
        if (m) {
          var inputShape = Scratch.getInputShape(part);
          var name = names.shift();
          name = name.replace(/ \?$/, "?");
          switch (inputShape) {
            case 'number':  return '(' + name + ')';
            case 'string':  return '[' + name + ']';
            case 'boolean': return '<' + name + '>';
            default: return part + '[' + name + ']';
          }
        } else {
          return part.split(/ +/g).map(function(word) {
            if (word === '\\%') return '%';
            return word;
          }).join(' ');
        }
      }).join('');
    }

    // top-level reporters
    if (info.shape === 'reporter' || info.shape === 'predicate') {
      return generateReporter(block, null, -Infinity);
    }

    var level = +Infinity;
    if (info._isCustom) level = -2;
    var result = generateParts(info, args, level);

    switch (info.shape) {
      case 'if-block': // if/else?
        var lines = [result];
        lines = lines.concat(generateMouth(args.shift()));
        if (args.length) {
          lines.push('else');
          lines = lines.concat(generateMouth(args.shift()));
        }
        lines.push('end');
        return lines;
      case 'c-block':
      case 'c-block cap':
        var lines = [result];
        lines = lines.concat(generateMouth(args.shift()));
        lines.push('end');
        return lines;
      default:
        return [result];
    }
  }

  function generateMouth(list) {
    var lines = generateList(list || []);
    if (!lines.length) lines = ['...'];
    return indent(lines);
  }

  function generateReporter(block, inputShape, outerLevel, argIndex) {
    var selector = block[0],
        args = block.slice(1),
        info = Scratch.blocksBySelector[selector];

    if (selector === 'getParam') {
      info = {
        shape: args.pop() === 'b' ? 'predicate' : 'reporter',
        parts: info.parts,
      };
    }

    var level = Language.precedence[selector] || 0;

    var result = generateParts(info, args, level);

    var needsParens = (level > outerLevel
                    || (selector === '|' &&
                        outerLevel === Language.precedence['&'])
                    || (selector === '&' &&
                        outerLevel === Language.precedence['|'])
                    || inputShape === 'color'
                    || (inputShape !== 'boolean' && info.shape === 'predicate')
                    || (level === outerLevel &&
                        ['-', '/', '%'].indexOf(selector) > -1 &&
                        argIndex === 1)
                    || inputShape === 'readonly-menu'
                    || selector === 'contentsOfList:'
                    || (level === -1 && outerLevel > 0) // join
                      );
    if (needsParens) {
      switch (info.shape) {
        case 'predicate': result = '<' + result + '>'; break;
        default:          result = '(' + result + ')'; break;
      }
    }
    return result;
  }

  function generateParts(info, args, outerLevel) {
    var argIndex = 0;
    var result = [];
    for (var i=0; i<info.parts.length; i++) {
      var part = info.parts[i];
      var m = Scratch.inputPat.exec(part);
      if (m) {
          var inputShape = Scratch.getInputShape(part);
          var value = args.shift();
          var menu = part.split('.').pop();
          if (value instanceof Array) {
            part = generateReporter(value, inputShape, outerLevel, argIndex);
          } else if (part === '%s' &&
              Language.blocksWithNumberLiterals.indexOf(info.selector) > -1) {
            // string input, that we might show as a number literal
            var isNumber = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(value);
            part = isNumber ? '' + value : generateStringLiteral(value);
          } else {
            part = generateLiteral(value, inputShape, menu, outerLevel);
          }
          argIndex += 1;
      } else {
        part = part.split(/( +)/g).map(function(word) {
          if (/[:]$/.test(word)) word += ' ';
          return images[word] || word || '';
        }).join('');
      }
      result.push(part);
    }
    return result.join('').replace(/ +/, ' ');
  }

  function generateLiteral(value, inputShape, menu, level) {
    switch (inputShape) {
      case 'color':
        return generateColorLiteral(parseInt(value));
      case 'boolean':
        if (!value) return '<>';
        assert(false, 'literal non-false booleans not allowed: ' + value);
      case 'readonly-menu':
        return generateMenuLiteral(value, menu);
      case 'string':
        return generateStringLiteral(value);
      case 'number':
        // nb. Scratch saves empty number slots as 0
        // so it is always allowable to convert a number slot to zero
        var number = Number(value);
        return Number(value) || 0;
      default:
        // TODO
        return value;
    }
  }

  function generateMenuLiteral(value, menu) {
    switch (value) {
      case '_mouse_':  return 'mouse-pointer';
      case '_myself_': return 'myself';
      case '_stage_':  return 'Stage';
      case '_edge_':  return 'edge';
      case '_random_':  return 'random position';
    }
    if (isStringMenu(menu, value)) {
      return generateStringLiteral(value);
    } else {
      if (menu === 'param') {
        value = value.replace(/ \?$/, "?");
      }
      return value;
    }
  }

  function isStringMenu(menu, value) {
    if (Language.menusThatAcceptReporters.indexOf(menu) > -1) {
      return true;
    }
    if (menu === 'attribute' &&
        Language.menuOptions.attribute.indexOf(value) === -1) {
      return true;
    }
    return false;
  }

  function generateStringLiteral(value) {
    var value = value === undefined ? "" : "" + value;
    return '"' + value.replace(/\\/g, '\\\\')
                      .replace(/"/g, '\\"') + '"';
  }

  function generateColorLiteral(number) {
    if (number < 0) number = 0xFFFFFFFF + number + 1;
    var hex = number.toString(16);
    hex = hex.slice(Math.max(0, hex.length - 6)); // last 6 characters
    while (hex.length < 6) hex = '0' + hex;
    if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
      hex = hex[0] + hex[2] + hex[4];
    }
    return '#' + hex;
  }

  function indent(lines) {
    return lines.map(function(x) { return '\t' + x; });
  }


module.exports = { generateBlock }
