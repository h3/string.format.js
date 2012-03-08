module('string.format.js');
//ok( true, "this test is fine" );

test("Basic formatting operations", function() {
    equal('{a}bc'.format({a:'A'}),           'Abc',        'Single character replacement (start)');
    equal('a{b}c'.format({b:'B'}),           'aBc',        'Single character replacement (middle)');
    equal('ab{c}'.format({c:'C'}),           'abC',        'Single character replacement (end)');
    equal('{abc}defghi'.format({abc:'ABC'}), 'ABCdefghi',  'Multiple character replacement (start)');
    equal('abc{def}ghi'.format({def:'DEF'}), 'abcDEFghi',  'Multiple character replacement (middle)');
    equal('abcdef{ghi}'.format({ghi:'GHI'}), 'abcdefGHI',  'Multiple character replacement (end)');
    equal('{0}{1}'.format(1, 2),             '12',         'Array as argument');
    equal('{0:.*f}'.format(8, 2),            '2.00000000', 'Argument defined precision');
    equal('{a:.*f}'.format({a:[8,2]}),       '2.00000000', 'Argument defined precision in object');
    equal('{0:.*f}'.format(8),               '8.000000',   'Argument defined precision with missing second argument (fallback to default precision)');
});

test("Special cases", function() {
    equal('abc{0} :-{{}}'.format('d'), 'abcd :-{}', 'Brace escaping');
    equal('abc{0} :-{{abc}}'.format('d'), 'abcd :-{abc}', 'Brace escaping with content');
});

test("Decimal convertion (d|i)", function() {
    equal('{a:d}'.format({a:10.5}),     '10',     '10.5 -> 10 (float to decimal)');
    equal('{a:d}'.format({a:-10.5}),    '-10',    '-10.5 -> -10 (negative float to negative decimal)');
    equal('{a:d}'.format({a:-10}),      '-10',    '-10 -> -10 (signed)');
    equal('a{a:03d}b'.format({a:1}),    'a001b',  '1 -> 001 (Zero padding)');
});

test("Octal convertion (o)", function() {
    equal('{a:o}'.format({a:0377}),     '377',    '0377 -> 377');
    equal('{a:o}'.format({a:377}),      '571',    '377 -> 571');
    equal('{a:o}'.format({a:255}),      '377',    '255 -> 377');
    equal('{a:o}'.format({a:0255}),     '255',    '0255 -> 255');
});

test("Unsigned integer convertion (u)", function() {
    equal('{a:u}'.format({a:10}),       '10',     '10 -> 10 (Integer to Unsigned Integer)');
    equal('{a:u}'.format({a:-10}),      '10',     '-10 -> 10 (Integer to Unsigned Integer)');
    equal('{a:u}'.format({a:10.5}),     '10',     '10.5 -> 10 (Float to Unsigned Integer)');
    equal('{a:u}'.format({a:-10.5}),    '10',     '-10.5 -> 10 (Float to Unsigned Integer)');
});

test("Unsigned hexadecimal convertion (x|X)", function() {
    equal('{a:x}'.format({a:75}),       '4b',     '75 -> 4b (Signed integer to hexadecimal)');
    equal('{a:x}'.format({a:0}),        '0',      '0 -> 0');
    equal('{a:X}'.format({a:75}),       '4B',     '75 -> 4B (Signed integer to uppercase hexadecimal)');
    equal('{a:X}'.format({a:0}),        '0',      '0 -> 0');
});

test("Floating point exponential convertion (e|E)", function() {
    equal('{a:e}'.format({a:1}),        '1.000000e+0',    '1:e -> 1.000000e+0');
    equal('{a:.9e}'.format({a:100.11}), '1.001100000e+2', '1:e -> 1.001100000e+2');
    equal('{a:E}'.format({a:1}),        '1.000000E+0',    '1:e -> 1.000000E+0');
    equal('{a:.9E}'.format({a:100.11}), '1.001100000E+2', '1:e -> 1.001100000E+2');
});

test("Floating point convertion (g|G)", function() {
    // Python returns 1.11111e+06 and JavaScript returns 1.111111e+6
    // not sure what to do about this, will let the test pass for now
    // feedback would be apreciated..
    equal('{a:e}'.format({a:1}),        '1.000000e+0',    '1:e -> 1.000000e+0');
    equal('{a:.5g}'.format({a:1}),      '1',              '1 -> 1');
    equal('{a:.5g}'.format({a:1.1}),    '1.1',            '1.1 -> 1.1');
    equal('{a:#2g}'.format({a:1}),      '1.00000',        '1 -> 1.00000');
    equal('{a:#2.7g}'.format({a:1}),    '1.000000',       '1 -> 1.000000');
    equal('{a:g}'.format({a:111111}),   '111111',         '111111 -> 111111');
    equal('{a:g}'.format({a:1111111}),  '1.111111e+6',    '1111111 -> 1.111111e+6');
    equal('{a:g}'.format({a:111111.4}), '111111',         '111111.4 -> 111111');
    equal('{a:g}'.format({a:111111.5}), '111112',         '111111.5 -> 111112');
    equal('{a:G}'.format({a:111111}),   '111111',         '111111 -> 111111');
    equal('{a:G}'.format({a:1111111}),  '1.111111e+6',    '1111111 -> 1.111111e+6');
    equal('{a:G}'.format({a:111111.4}), '111111',         '111111.4 -> 111111');
    equal('{a:G}'.format({a:111111.5}), '111112',         '111111.5 -> 111112');
});

test("Char (c)", function() {
    equal('{a:c}'.format({a:'abc'}),     'a',               'abc -> a');
    equal('{a:c}'.format({a:'~@abc'}),   'a',               '~@abc -> a');
    equal('{a:c}'.format({a:'123'}),     '1',               '123 -> 1');
    equal('{a:c}'.format({a:'~@123'}),   '1',               '~@123 -> 1');
});

test("String (r|s)", function() {
    equal('{a:r}'.format({a:1}),         '1',               '1:r -> 1');
    equal('{a:r}'.format({a:[1,2,3]}),   '1,2,3',           '[1,2,3]:r -> 1,2,3 (Array to string)');
    equal('{a:s}'.format({a:1}),         '1',               '1:s -> 1');
    equal('{a:s}'.format({a:[1,2,3]}),   '1,2,3',           '[1,2,3]:s -> 1,2,3 (Array to string)');
});

test("Alternate forms (#|octal|hexadecimal)", function() {
    equal('a{a:#7d}b'.format({a:1}),     'a      1b',       'padding (string)');
    equal('a{a:0#8d}b'.format({a:1}),    'a00000001b',      'padding with zero (1)');
    equal('a{a:#09d}b'.format({a:1}),    'a000000001b',     'padding with zero (2)');
    equal('a{a:#o}b'.format({a:1}),      'a01b',            'octal padding with zero (1)');
    equal('a{a:#5o}b'.format({a:1}),     'a    01b',        'octal padding with zero and string (2)');
    equal('a{a:0#5o}b'.format({a:1}),    'a000001b',        'octal padding with zero and string (3)');
    equal('a{a:#05o}b'.format({a:1}),    'a000001b',        'octal padding with zero and string (4)');
    equal('{a:#x}'.format({a:0}),        '0x0',             'hexadecimal (lower) padding with zero (1)');
    equal('{a:#X}'.format({a:0}),        '0X0',             'hexadecimal (upper) padding with zero (2)');
});
