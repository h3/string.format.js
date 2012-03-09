module('string.format.js');
//ok( true, "this test is fine" );
var arguments2Array = function(args, shift) {
    // Converts regular JavaScript arguments to a
    // real JavaScript Array object.
    var o, x, l;
    for (o = [], l = args.length, x = (shift || 0); x < l; x++) o.push(args[x]);
    return o;
};

var assert,
STRING_FORMAT_TESTS = {
    "Basic formatting operations!!": [
        ['equal', '{a}bc',       [{a:'A'}],     'Abc',        'Single character replacement (start)'],
        ['equal', 'a{b}c',       [{b:'B'}],     'aBc',        'Single character replacement (middle)'],
        ['equal', 'ab{c}',       [{c:'C'}],     'abC',        'Single character replacement (end)'],
        ['equal', '{abc}defghi', [{abc:'ABC'}], 'ABCdefghi',  'Multiple character replacement (start)'],
        ['equal', 'abc{def}ghi', [{def:'DEF'}], 'abcDEFghi',  'Multiple character replacement (middle)'],
        ['equal', 'abcdef{ghi}', [{ghi:'GHI'}], 'abcdefGHI',  'Multiple character replacement (end)'],
        ['equal', '{0}{1}',      [1, 2],        '12',         'Array as argument'],
        ['equal', '{0:.*f}',     [8, 2],        '2.00000000', 'Argument defined precision'],
        ['equal', '{a:.*f}',     [{a:[8,2]}],   '2.00000000', 'Argument defined precision in object'],
        ['equal', '{0:.*f}',     [8],           '8.000000',   'Argument defined precision with missing second argument (fallback to default precision)']
    ],
    "Basic formatting operations": [
        ['equal', '{a}bc',       [{a:'A'}],     'Abc',        'Single character replacement (start)'],
        ['equal', 'a{b}c',       [{b:'B'}],     'aBc',        'Single character replacement (middle)'],
        ['equal', 'ab{c}',       [{c:'C'}],     'abC',        'Single character replacement (end)'],
        ['equal', '{abc}defghi', [{abc:'ABC'}], 'ABCdefghi',  'Multiple character replacement (start)'],
        ['equal', 'abc{def}ghi', [{def:'DEF'}], 'abcDEFghi',  'Multiple character replacement (middle)'],
        ['equal', 'abcdef{ghi}', [{ghi:'GHI'}], 'abcdefGHI',  'Multiple character replacement (end)'],
        ['equal', '{0}{1}',      [1, 2],        '12',         'Array as argument'],
        ['equal', '{0:.*f}',     [[8, 2]],      '2.00000000', 'Argument defined precision'],
        ['equal', '{a:.*f}',     [{a:[8,2]}],   '2.00000000', 'Argument defined precision in object'],
        ['equal', '{0:.*f}',     [[8]],         '8.000000',   'Argument defined precision with missing second argument (fallback to default precision)']
    ],

    "Special cases": [
        ['equal', 'abc{0} :-{{}}',    ['d'],    'abcd :-{}',    'Brace escaping'],
        ['equal', 'abc{0} :-{{abc}}', ['d'],    'abcd :-{abc}', 'Brace escaping with content']
    ],

    "Decimal convertion (d|i)": [
        ['equal', '{a:d}',       [{a:10.5}],    '10',         '10.5 -> 10 (float to decimal)'],
        ['equal', '{a:d}',       [{a:-10.5}],   '-10',        '-10.5 -> -10 (negative float to negative decimal)'],
        ['equal', '{a:d}',       [{a:-10}],     '-10',        '-10 -> -10 (signed)'],
        ['equal', 'a{a:03d}b',   [{a:1}],       'a001b',      '1 -> 001 (Zero padding)']
    ],

    "Octal convertion (o)": [
        ['equal', '{a:o}',       [{a:0377}],     '377',       '0377 -> 377'],
        ['equal', '{a:o}',       [{a:377}],      '571',       '377 -> 571'],
        ['equal', '{a:o}',       [{a:255}],      '377',       '255 -> 377'],
        ['equal', '{a:o}',       [{a:0255}],     '255',       '0255 -> 255']
    ],

    "Unsigned integer convertion (u)": [
        ['equal', '{a:u}',       [{a:10}],       '10',        '10 -> 10 (Integer to Unsigned Integer)'],
        ['equal', '{a:u}',       [{a:-10}],      '10',        '-10 -> 10 (Integer to Unsigned Integer)'],
        ['equal', '{a:u}',       [{a:10.5}],     '10',        '10.5 -> 10 (Float to Unsigned Integer)'],
        ['equal', '{a:u}',       [{a:-10.5}],    '10',        '-10.5 -> 10 (Float to Unsigned Integer)']
    ],

    "Unsigned hexadecimal convertion (x|X)": [
        ['equal', '{a:x}',       [{a:75}],       '4b',        '75 -> 4b (Signed integer to hexadecimal)'],
        ['equal', '{a:x}',       [{a:0}],        '0',         '0 -> 0'],
        ['equal', '{a:X}',       [{a:75}],       '4B',        '75 -> 4B (Signed integer to uppercase hexadecimal)'],
        ['equal', '{a:X}',       [{a:0}],        '0',         '0 -> 0']
    ],

    "Floating point exponential convertion (e|E)": [
        ['equal', '{a:e}',       [{a:1}],        '1.000000e+0',    '1:e -> 1.000000e+0'],
        ['equal', '{a:.9e}',     [{a:100.11}],   '1.001100000e+2', '1:e -> 1.001100000e+2'],
        ['equal', '{a:E}',       [{a:1}],        '1.000000E+0',    '1:e -> 1.000000E+0'],
        ['equal', '{a:.9E}',     [{a:100.11}],   '1.001100000E+2', '1:e -> 1.001100000E+2']
    ],

    "Floating point convertion (g|G)": [
        // Python returns 1.11111e+06 and JavaScript returns 1.111111e+6
        // not sure what to do about this, will let the test pass for now
        // feedback would be apreciated..
        ['equal', '{a:e}',       [{a:1}],         '1.000000e+0',   '1:e -> 1.000000e+0'],
        ['equal', '{a:.5g}',     [{a:1}],         '1',             '1 -> 1'],
        ['equal', '{a:.5g}',     [{a:1.1}],       '1.1',           '1.1 -> 1.1'],
        ['equal', '{a:#2g}',     [{a:1}],         '1.00000',       '1 -> 1.00000'],
        ['equal', '{a:#2.7g}',   [{a:1}],         '1.000000',      '1 -> 1.000000'],
        ['equal', '{a:g}',       [{a:111111}],    '111111',        '111111 -> 111111'],
        ['equal', '{a:g}',       [{a:1111111}],   '1.111111e+6',   '1111111 -> 1.111111e+6'],
        ['equal', '{a:g}',       [{a:111111.4}],  '111111',        '111111.4 -> 111111'],
        ['equal', '{a:g}',       [{a:111111.5}],  '111112',        '111111.5 -> 111112'],
        ['equal', '{a:G}',       [{a:111111}],    '111111',        '111111 -> 111111'],
        ['equal', '{a:G}',       [{a:1111111}],   '1.111111e+6',   '1111111 -> 1.111111e+6'],
        ['equal', '{a:G}',       [{a:111111.4}],  '111111',        '111111.4 -> 111111'],
        ['equal', '{a:G}',       [{a:111111.5}],  '111112',        '111111.5 -> 111112']
    ],

    "Char (c)": [
        ['equal', '{a:c}',       [{a:'abc'}],     'a',               'abc -> a'],
        ['equal', '{a:c}',       [{a:'~@abc'}],   'a',               '~@abc -> a'],
        ['equal', '{a:c}',       [{a:'123'}],     '1',               '123 -> 1'],
        ['equal', '{a:c}',       [{a:'~@123'}],   '1',               '~@123 -> 1']
    ],

    "String (r|s)": [
        ['equal', '{a:r}',       [{a:1}],         '1',               '1:r -> 1'],
        ['equal', '{a:r}',       [{a:[1,2,3]}],   '1,2,3',           '[1,2,3]:r -> 1,2,3 (Array to string)'],
        ['equal', '{a:s}',       [{a:1}],         '1',               '1:s -> 1'],
        ['equal', '{a:s}',       [{a:[1,2,3]}],   '1,2,3',           '[1,2,3]:s -> 1,2,3 (Array to string)']
    ],

    "Alternate forms (#|octal|hexadecimal)": [
        ['equal', 'a{a:#7d}b',   [{a:1}],         'a      1b',       'padding (string)'],
        ['equal', 'a{a:0#8d}b',  [{a:1}],         'a00000001b',      'padding with zero (1)'],
        ['equal', 'a{a:#09d}b',  [{a:1}],         'a000000001b',     'padding with zero (2)'],
        ['equal', 'a{a:#o}b',    [{a:1}],         'a01b',            'octal padding with zero (1)'],
        ['equal', 'a{a:#5o}b',   [{a:1}],         'a    01b',        'octal padding with zero and string (2)'],
        ['equal', 'a{a:0#5o}b',  [{a:1}],         'a000001b',        'octal padding with zero and string (3)'],
        ['equal', 'a{a:#05o}b',  [{a:1}],         'a000001b',        'octal padding with zero and string (4)'],
        ['equal', '{a:#x}',      [{a:0}],         '0x0',             'hexadecimal (lower) padding with zero (1)'],
        ['equal', '{a:#X}',      [{a:0}],         '0X0',             'hexadecimal (upper) padding with zero (2)']
    ]
};

for (_test_ in STRING_FORMAT_TESTS) {
    test(_test_, function() {
        var assert, assertion;
        for (assertion in STRING_FORMAT_TESTS[_test_]) {
            assert = STRING_FORMAT_TESTS[_test_][assertion];
            // Test with jQuery
            if (typeof(jQuery) != 'undefined') {
                console.log(assert)
                window[assert[0]].apply(this, [
                    $.format.apply(this, [assert[1], assert[2]]), 
                    assert[3], 
                    assert[4]
                ]);
            }
            // Test with native String prototyping
            else {
                window[assert[0]].apply(this, [
                    assert[1].format.apply(assert[1], assert[2]), 
                    assert[3], 
                    assert[4]
                ]);
            }
        }
    });
}
