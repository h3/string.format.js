string.format.js
================

A framework independant implementation of Python's Advanced String Formatting in JavaScript.

Refs:

* http://docs.python.org/library/string.html
* http://www.python.org/dev/peps/pep-3101/
* http://docs.python.org/lib/typesseq-strings.html 
 

string.format examples
----------------------

Simple replacement
^^^^^^^^^^^^^^^^^^

::

    // all return "1bc"
    '{a}bc'.format({a:'1'}) // named arguments
    '{0}bc'.format([1])     // array arguments
    '{0}bc'.format(1)       // normal arguments

Type conversion
^^^^^^^^^^^^^^^
::
    '{a:d}bc'.format({a:'a1'})  // return "1bc"
    '{a:d}bc'.format({a:1.5})   // return "1bc"
    '{a:.2f}bc'.format({a:'1'}) // returns 1.00bc

Padding
^^^^^^^
::
    $.format('{a:08.2f}bc', {a:'1'}) // return 00001.00bc

.. User defined formatting
..
.. $.extend(jQuery.strConversion, 
..     {'U': function(input, arg){ return input.toUpperCase(); }
.. });
..
.. $.format('{0:U}bc', 'a') // return Abc

Known issues
------------

 * JavaScript precision is more limited than Python
 * Python zero pad exponent (10 -> 1.0e+01), not JavaScript (10 -> 1.0e+1)
 * The repr implementation is different in python

The conversion flags
--------------------
+----------+-----------------------------------------------------------------+
| **Flag** | **Meaning**                                                     |
+----------+-----------------------------------------------------------------+
| # 	   | The value conversion will use the alternate form                |
+----------+-----------------------------------------------------------------+
| 0 	   | The conversion will be zero padded for numeric values.          |
+----------+-----------------------------------------------------------------+
| - 	   | The converted value is left adjusted (overrides the "0"         |
|          | conversion if both are given). [1]_                             |
+----------+-----------------------------------------------------------------+
| <space>  | A blank or an empty string should be left before a positive     |
|          | number produced by a signed conversion. [1]_                    |
+----------+-----------------------------------------------------------------+
| + 	   | A sign character ("+" or "-") will precede the conversion       |
|          | (overrides a "space" flag). [1]_                                |
+----------+-----------------------------------------------------------------+

Conversions types
-----------------
+-----------+----------------------------------------------------------------+
| **Type**  | **Description**                                                |
+-----------+----------------------------------------------------------------+
| d 	    | Signed integer decimal  	                                     |
+-----------+----------------------------------------------------------------+
| i 	    | Signed integer decimal                                         |
+-----------+----------------------------------------------------------------+
| o 	    | Unsigned octal [2]_                                            |
+-----------+----------------------------------------------------------------+
| u 	    | Unsigned decimal                                               |
+-----------+----------------------------------------------------------------+
| x 	    | Unsigned hexadecimal (lowercase) [3]_                          |
+-----------+----------------------------------------------------------------+
| X 	    | Unsigned hexadecimal (uppercase)  [3]_                         |
+-----------+----------------------------------------------------------------+
| e 	    | Floating point exponential format (lowercase) [4]_             |
+-----------+----------------------------------------------------------------+
| E 	    | Floating point exponential format (uppercase) [4]_             |
+-----------+----------------------------------------------------------------+
| f 	    | Floating point decimal format [4]_                             |
+-----------+----------------------------------------------------------------+
| F 	    | Floating point decimal format [4]_                             |
+-----------+----------------------------------------------------------------+
| g 	    | Floating point format. uses exponential format if exponent is  |
|           | greater than -4 or less than precision, decimal format         |
|           | otherwise [5]_                                                 |
+-----------+----------------------------------------------------------------+
| G 	    | Floating point format. Uses exponential format if exponent is  |
|           | greater than -4 or less than precision, decimal format         |
|           | otherwise [5]_                                                 |
+-----------+----------------------------------------------------------------+
| c 	    | Single character (accepts integer or single character string)  |	
+-----------+----------------------------------------------------------------+
| r 	    | String (converts any JavaScript object using repr()) [6]_      |
+-----------+----------------------------------------------------------------+
| s 	    | String (converts any JavaScript object using toString()) [7]_  |
+-----------+----------------------------------------------------------------+

Footnotes
^^^^^^^^^

.. [1] Unsupported
.. [2] The alternate form causes a leading zero ("0") to be inserted between left-hand padding and the formatting of the number if the leading character of the result is not already a zero.
.. [3] The alternate form causes a leading '0x' or '0X' (depending on whether the "x" or "X" format was used) to be inserted between left-hand padding and the formatting of the number if the leading character of the result is not already a zero.
.. [4] The alternate form causes the result to always contain a decimal point, even if no digits follow it. The precision determines the number of digits after the decimal point and defaults to 6.
.. [5] The alternate form causes the result to always contain a decimal point, and trailing zeroes are not removed as they would otherwise be. The precision determines the number of significant digits before and after the decimal point and defaults to 6.
.. [6] The %r conversion was added in Python 2.0. The precision determines the maximal number of characters used.
.. [7] If the object or format provided is a unicode string, the resulting string will also be unicode. The precision determines the maximal number of characters used. 
