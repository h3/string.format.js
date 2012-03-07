test("a basic test example", function() {
  ok( true, "this test is fine" );
  var value = "hello";
  equal( value, "hello", "We expect value to be hello" );
});

//module('jquery.strings.js');
//test('Replacement and conversions', function() {
//    test_format([
//
//        // Bug #12: http://code.google.com/p/jquery-utils/issues/detail?id=12
//        ['My name is {0} :-{{}}',  'Fred', 'My name is Fred :-{}', 'Brace escaping (bug #12)'],
//        ['My name is {0} :-{{abc}}',  'Fred', 'My name is Fred :-{abc}', 'Brace escaping (bug #12)'],
//        ['{a}bc',       {a:'A'},     'Abc',       'Basic string replacement: Single character replacement (start)'],
//        ['a{b}c',       {b:'B'},     'aBc',       'Basic string replacement: Single character replacement (middle)'],
//        ['ab{c}',       {c:'C'},     'abC',       'Basic string replacement: Single character replacement (end)'],
//        ['{abc}defghi', {abc:'ABC'}, 'ABCdefghi', 'Basic string replacement: Multiple character replacement (start)'],
//        ['abc{def}ghi', {def:'DEF'}, 'abcDEFghi', 'Basic string replacement: Multiple character replacement (middle)'],
//        ['abcdef{ghi}', {ghi:'GHI'}, 'abcdefGHI', 'Basic string replacement: Multiple character replacement (end)'],
//        ['{0}{1}',      [1,2],       '12',        'Basic string replacement: Array as argument'],
//        ['{0:.*f}',     [8,2],       '2.00000000','Basic string replacement: Argument defined precision'],
//        ['{a:.*f}',     {a:[8,2]},   '2.00000000','Basic string replacement: Argument defined precision in object'],
//        ['{0:.*f}',     [8],         '8.000000',  'Basic string replacement: Argument defined precision with missing second argument (fallback to default precision)'],
//        // TODO: escapinng
//        // DECIMAL (d|i)
//        ['{a:d}',       {a:10.5},  '10',     'DECIMAL (d|i): 10.5 -> 10 (float to decimal)'],
//        ['{a:d}',       {a:-10.5}, '-10',    'DECIMAL (d|i): -10.5 -> -10 (negative float to negative decimal)'],
//        ['{a:d}',       {a:-10},   '-10',    'DECIMAL (d|i): -10 -> -10 (signed)'],
//        ['a{a:03d}b',   {a:1},     'a001b',  'DECIMAL (d|i): 1 -> 001 (Zero padding)'],
//        // OCTAL (o)
//        ['{a:o}', {a:0377}, '377', 'OCTAL (o): 0377 -> 377'],
//        ['{a:o}', {a:377},  '571', 'OCTAL (o): 377 -> 571'],
//        ['{a:o}', {a:255},  '377', 'OCTAL (o): 255 -> 377'],
//        ['{a:o}', {a:0255}, '255', 'OCTAL (o): 0255 -> 255'],
//        // UNSIGNED INT (u)
//        ['{a:u}', {a:10},    '10', 'UNSIGNED INT (u): 10 -> 10 (Integer to Unsigned Integer)'],
//        ['{a:u}', {a:-10},   '10', 'UNSIGNED INT (u): -10 -> 10 (Integer to Unsigned Integer)'],
//        ['{a:u}', {a:10.5},  '10', 'UNSIGNED INT (u): 10.5 -> 10 (Float to Unsigned Integer)'],
//        ['{a:u}', {a:-10.5}, '10', 'UNSIGNED INT (u): -10.5 -> 10 (Float to Unsigned Integer)'],
//        // UNSIGNED HEXADECIMAL (x|X)
//        ['{a:x}', {a:75}, '4b', 'UNSIGNED HEXADECIMAL (x|X): 75 -> 4b (Signed integer to hexadecimal)'],
//        ['{a:x}', {a:0},  '0',  'UNSIGNED HEXADECIMAL (x|X): 0 -> 0'],
//        ['{a:X}', {a:75}, '4B', 'UNSIGNED HEXADECIMAL (x|X): 75 -> 4B (Signed integer to uppercase hexadecimal)'],
//        ['{a:X}', {a:0},  '0',  'UNSIGNED HEXADECIMAL (x|X): 0 -> 0'],
//        // FLOATING POINT EXPONENTIAL (e|E)
//        ['{a:e}',   {a:1},      '1.000000e+0',      'FLOATING POINT EXPONENTIAL (e|E): 1:e -> 1.000000e+0'],
//        ['{a:.9e}', {a:100.11}, '1.001100000e+2',   'FLOATING POINT EXPONENTIAL (e|E): 1:e -> 1.001100000e+2'],
//        ['{a:E}',   {a:1},      '1.000000E+0',      'FLOATING POINT EXPONENTIAL (e|E): 1:e -> 1.000000E+0'],
//        ['{a:.9E}', {a:100.11}, '1.001100000E+2',   'FLOATING POINT EXPONENTIAL (e|E): 1:e -> 1.001100000E+2'],
//        // FLOATING POINT (g|G)
//        // Python returns 1.11111e+06 and JavaScript returns 1.111111e+6
//        // not sure what to do about this, will let the test pass for now
//        // feedback would be apreciated..
//        ['{a:.5g}', {a:1},      '1',           'FLOATING POINT (g|G): 1 -> 1'],
//        ['{a:.5g}', {a:1.1},    '1.1',         'FLOATING POINT (g|G): 1.1 -> 1.1'],
//        ['{a:#2g}', {a:1},      '1.00000',     'FLOATING POINT (g|G): 1 -> 1.00000'],
//        ['{a:#2.7g}', {a:1},    '1.000000',    'FLOATING POINT (g|G): 1 -> 1.000000'],
//        ['{a:g}', {a:111111},   '111111',      'FLOATING POINT (g|G): 111111 -> 111111'],
//        ['{a:g}', {a:1111111},  '1.111111e+6', 'FLOATING POINT (g|G): 1111111 -> 1.111111e+6'],
//        ['{a:g}', {a:111111.4}, '111111',      'FLOATING POINT (g|G): 111111.4 -> 111111'],
//        ['{a:g}', {a:111111.5}, '111112',      'FLOATING POINT (g|G): 111111.5 -> 111112'],
//        ['{a:G}', {a:111111},   '111111',      'FLOATING POINT (g|G): 111111 -> 111111'],
//        ['{a:G}', {a:1111111},  '1.111111e+6', 'FLOATING POINT (g|G): 1111111 -> 1.111111e+6'],
//        ['{a:G}', {a:111111.4}, '111111',      'FLOATING POINT (g|G): 111111.4 -> 111111'],
//        ['{a:G}', {a:111111.5}, '111112',      'FLOATING POINT (g|G): 111111.5 -> 111112'],
//        // SINGLE CHARACTER (c)
//        ['{a:c}', {a:'abc'},    'a', 'SINGLE CHARACTER (c): abc -> a'],
//        ['{a:c}', {a:'~@abc'},  'a', 'SINGLE CHARACTER (c): ~@abc -> a'],
//        ['{a:c}', {a:'123'},    '1', 'SINGLE CHARACTER (c): 123 -> 1'],
//        ['{a:c}', {a:'~@123'},  '1', 'SINGLE CHARACTER (c): ~@123 -> 1'],
//        // STRING (r)
//        ['{a:r}', {a:1},        '1',     'STRING (r): 1:r -> 1'],
//        ['{a:r}', {a:[1,2,3]},  '1,2,3', 'STRING (r): [1,2,3]:r -> 1,2,3 (Array to string)'],
//        // STRING (s)
//        ['{a:s}', {a:1},       '1',     'STRING (s): 1:s -> 1'],
//        ['{a:s}', {a:[1,2,3]}, '1,2,3', 'STRING (s): [1,2,3]:s -> 1,2,3 (Array to string)'],
//        // ALTERNATE FORM (#)
//        ['a{a:#7d}b',  {a:1}, 'a      1b',    'ALTERNATE FORM (#): Alternate form padding (string)'],
//        ['a{a:0#8d}b', {a:1}, 'a00000001b',   'ALTERNATE FORM (#): Alternate form padding with zero (1)'],
//        ['a{a:#09d}b', {a:1}, 'a000000001b',  'ALTERNATE FORM (#): Alternate form padding with zero (2)'],
//        // ALTERNATE FORM (octal)
//        ['a{a:#o}b',   {a:1}, 'a01b',         'ALTERNATE FORM (#): Alternate form octal padding with zero (1)'],
////      ['a{a:#5o}b',  {a:1}, 'a   01b',      'ALTERNATE FORM (#): Alternate form octal padding with zero and string (2)'],
////      ['a{a:0#5o}b', {a:1}, 'a00001b',      'ALTERNATE FORM (#): Alternate form octal padding with zero and string (3)'],
////      ['a{a:#05o}b', {a:1}, 'a00001b',      'ALTERNATE FORM (#): Alternate form octal padding with zero and string (4)'],
//        // ALTERNATE FORM (hexadecimal)
//        ['{a:#x}',     {a:0}, '0x0',          'ALTERNATE FORM (#): Alternate form hexadecimal (lower) padding with zero (1)'],
//        ['{a:#X}',     {a:0}, '0X0',          'ALTERNATE FORM (#): Alternate form hexadecimal (upper) padding with zero (2)'],
//    ]);
//});
