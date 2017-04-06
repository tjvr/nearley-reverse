nearley-reverse
===============

A parser turns a string into a parse tree. `nearley-reverse` does the opposite: it **turns a parse tree into a string**.

It's based on your grammar for [nearley](https://nearley.js.org), so it will always generate **valid syntax**, and it will respect **operator precedence**. And it tries to keep the resulting strings as **short as possible**, which means that it will only insert parentheses (for example) where necessary.

The flagship use case is for [tosh](https://tosh.tjvr.org/), a text-based editor for Scratch projects. Since Scratch projects store the abstract syntax tree, tosh works the same way: it compiles your code to an AST before saving, and upon loading it must therefore generate source code from the AST. Previous versions of tosh have subtle bugs in the way I implemented this; this project is the "fully correct" rewrite version. :-)

`nearley-reverse` doesn't like ambiguity. This could probably be fixed, but in practice most people run away screaming from ambiguous grammars, and you probably should too.


How do I use it?
================

You must annotate your nearley grammar to use **factories** instead of postprocessors. A factory is just like a postprocessor function, except it additionally has an `encode` method attached to it.

You might like to define yourself the following helper function, at the top of your `.ne` file:

```js
@{%
function factory(decode, encode) {
  decode.encode = encode
  return decode
}
// ...
%}
```

We should also update the `id` built-in.

```js
id.encode = x => [x]
```

Now we can start writing our own factories. Imagine we have the following postprocessor:

```js
number -> [0-9]:+       {% d => parseInt(d.join('')) %}
```

It takes an array of digits, concatenates 'em together, and parses the resulting string as an integer.

An encoder should do the **inverse operation** -- the exact opposite. So we need to convert the integer to a string, and convert that string to an array.

```js
number -> [0-9]:+    {% factory(
    d => parseInt(d.join('')), // decode
    n => Array.from(''+d) // encode
) %}
```

But hold on--first, we need to **check it's an integer**! `nearley-reverse` doesn't know which grammar rule to use, for any node in your AST: so it will try each of them in turn. If the production rule doesn't apply, you **must** return `false`.

```js
number -> [0-9]:+    {% factory(
    d => parseInt(d.join('')), // decode
    n => typeof n === 'number' ? Array.from(''+d) : false // encode
) %}
```

And that's it! `nearley-reverse` takes care of the hard work of choosing which grammar rules to apply to get the shortest possible output string for your AST.

Go forth, and unparse things!

