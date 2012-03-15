/*
  string.format - version: 0.1
  JavaScript implementation of Python Advanced String Formatting

  MIT License (http://www.opensource.org/licenses/mit-license.php)
  
  (c) Maxime Haineault <max@motion-m.ca>
  http://motion-m.ca - http://haineault.com

  https://github.com/h3/string.format.js
  http://docs.python.org/library/string.html
  http://www.python.org/dev/peps/pep-3101/
  http://docs.python.org/lib/typesseq-strings.html 
*/

(function(){

    var arguments2Array = function(args, shift) {
        // Converts regular JavaScript arguments to a real JavaScript Array object.
        var o, x, l;
        for (o = [], l = args.length, x = (shift || 0); x < l; x++) o.push(args[x]);
        return o;
    };
    
    var Argument = function(arg, args) {
        // A manager for string format arguments.
        this.__arg  = arg;
        this.__args = args;
        this.__max_precision = parseFloat('1.' + (new Array(32)).join('1'), 10).toString().length - 3;
        this.__def_precision = 6;

        this.getString = function(){
            return this.__arg;
        };

        this.getKey = function(){
            return this.__arg.split(':')[0];
        };

        this.getFormat = function(){
            var match = this.getString().split(':');
            return (match && match[1]) ? match[1]: 's';
        };

        this.getPrecision = function(){
            var match = this.getFormat().match(/\.(\d+|\*)/g);
            if (!match) { return this.__def_precision; }
            else {
                match = match[0].slice(1);
                if (match != '*') { return parseInt(match, 10); }
                else if(strConversion.__getType(this.__args) == 'array') {
                    return this.__args[1] && this.__args[0] || this.__def_precision;
                }
                else if(strConversion.__getType(this.__args) == 'object') {
                    return this.__args[this.getKey()] && this.__args[this.getKey()][0] || this.__def_precision;
                }
                else return this.__def_precision;
            }
        };

        this.getPaddingLength = function(){
            var match = false;
            if (this.isAlternate()) {
                match = this.getString().match(/0?#0?(\d+)/);
                if (match && match[1]) return parseInt(match[1], 10);
            }
            match = this.getString().match(/(0|\.)(\d+|\*)/g);
            return match && parseInt(match[0].slice(1), 10) || 0;
        };

        this.getPaddingString = function(){
            var o = '';
            if (this.isAlternate()) o = ' ';
            // 0 (zero) take precedence on alternate format
            if (this.getFormat().match(/#0|0#|^0|\.\d+/)) o = '0';
            return o;
        };

        this.getFlags = function(){
            var match = this.getString().matc(/^(0|\#|\-|\+|\s)+/);
            return match && match[0].split('') || [];
        };

        this.isAlternate = function() {
            return !!this.getFormat().match(/^0?#/);
        };
    };  // Argument

    var strConversion = {
        __repr: function(i){
            // tries to translate any objects type into string gracefully
            var o, l, x;
            switch(this.__getType(i)) {
                case 'array':case 'date':case 'number':
                    return i.toString();
                case 'object': // Thanks to Richard Paul Lewis for the fix
                    o = []; 
                    l = i.length;
                    for(x = 0; x < l; x++) o.push(x + ': ' + this.__repr(i[x]));
                    return o.join(', ');                        
                case 'string': 
                    return i;
                default: 
                    return i;
            }
        },

        __getType: function(i) {
            // like typeof but less vague
            var match;
            if (!i || !i.constructor) return typeof(i);
            match = i.constructor.toString().match(/Array|Number|String|Object|Date/);
            return match && match[0].toLowerCase() || typeof(i);
        },

        __pad: function(str, l, s, t){
            // Jonas Raoni Soares Silva (http://jsfromhell.com/string/pad)
            var p = s || ' ', 
                o = str;
            if (l - str.length > 0) {
                o = new Array(Math.ceil(l / p.length)).join(p).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2)) + str + p.substr(0, l - t);
            }
            return o;
        },

        __getInput: function(arg, args) {
            var key, keys, subkey, obj;
            key = arg.getKey();
            switch(this.__getType(args)){
                case 'object': // Thanks to Jonathan Works for the patch
                    keys = key.split('.');
                    obj = args;
                    for(subkey = 0; subkey < keys.length; subkey++) obj = obj[keys[subkey]];
                    if (typeof(obj) != 'undefined') {
                        if (strConversion.__getType(obj) == 'array') {
                            return arg.getFormat().match(/\.\*/) && obj[1] || obj;
                        }
                        return obj;
                    }
                break;
                case 'array': 
                    key = parseInt(key, 10);
                    if (arg.getFormat().match(/\.\*/) && typeof args[key + 1] != 'undefined') return args[key + 1];
                    else if (typeof args[key] != 'undefined') return args[key];
                    else return key;
                break;
            }
            return '{'+key+'}';
        },

        __formatToken: function(token, args) {
            var arg   = new Argument(token, args);
            return strConversion[arg.getFormat().slice(-1)](this.__getInput(arg, args), arg);
        },

        d: function(input, arg) {
            // Signed integer decimal.
            var o = parseInt(input, 10), // enforce base 10
                p = arg.getPaddingLength();
            if (p) return this.__pad(o.toString(), p, arg.getPaddingString(), 0);
            else   return o;
        },

        i: function(input, args) { 
            // Signed integer decimal.
            return this.d(input, args);
        },

        o: function(input, arg) { 
            // Unsigned octal
            var o = input.toString(8);
            if (arg.isAlternate()) { o = this.__pad(o, o.length + 1, '0', 0); }
            return this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(), 0);
        },

        u: function(input, args) {
            // Unsigned decimal
            return Math.abs(this.d(input, args));
        },

        x: function(input, arg) {
            // Unsigned hexadecimal (lowercase)
            var o = parseInt(input, 10).toString(16);
            o = this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(),0);
            return arg.isAlternate() ? '0x' + o : o;
        },

        X: function(input, arg){
            // Unsigned hexadecimal (uppercase)
            return this.x(input, arg).toUpperCase();
        },

        e: function(input, arg){
            // Floating point exponential format (lowercase)
            return parseFloat(input, 10).toExponential(arg.getPrecision());
        },

        E: function(input, arg){
            // Floating point exponential format (uppercase)
            return this.e(input, arg).toUpperCase();
        },

        f: function(input, arg){
            // Floating point decimal format
            return this.__pad(
                parseFloat(input, 10).toFixed(arg.getPrecision()), 
                arg.getPaddingLength(), 
                arg.getPaddingString(),
                0);
        },

        F: function(input, args){
            // Floating point decimal format (alias)
            return this.f(input, args);
        },

        g: function(input, arg){
            // Floating point format. Uses exponential format if exponent is
            // greater than -4 or less than precision, decimal format otherwise
            var o = parseFloat(input, 10);
            return (o.toString().length > 6) 
                ? Math.round(o.toExponential(arg.getPrecision())): o;
        },

        G: function(input, args){
            // Floating point format. Uses exponential format if exponent is 
            // greater than -4 or less than precision, decimal format otherwise
            return this.g(input, args);
        },

        c: function(input, args) {
            // Single character (accepts integer or single character string). 	
            var match = input.match(/\w|\d/);
            return match && match[0] || '';
        },

        r: function(input, args) {
            // String (converts any JavaScript object to anotated format)
            return this.__repr(input);
        },

        s: function(input, args) {
            // String (converts any JavaScript object using object.toString())
            return input.toString && input.toString() || '' + input;
        }
    }; // strConversion

    var format = function() {
        var next, close,
            out   = [],
            str   = this,
            len   = this.length,
            args  = arguments[0]
            index = 0;

        while (index < len) {
            next = str.indexOf('{', index);
            if (next === -1) { out.push(str.slice(index, len)); break; }
            else {
                close = str.indexOf('}', next + 1);
                if (str[next + 1] == '{' && str[close + 1] === '}') { // Escape handling
                    out.push(str.slice(next + 1, close + 1))
                    index = close + 2;
                } else { // Append pre bracket chars to buffer
                    out.push(str.slice(index, next));
                    index = next + 1;
                    end = str.indexOf('}', index)
                    token = str.slice(index, end);
                    out.push(strConversion.__formatToken(token, (typeof args != 'object') 
                                ? arguments2Array(arguments): args || []));
                    index = end + 1;
                }
            }
        }
        return out.join('');
    };

    // jQuery integration
    if (typeof(jQuery) != 'undefined') {
        $.format = function() {
            var str = arguments[0];
            return format.apply(str, arguments2Array(arguments, 1))
        };
    }
    // Native prototyping
    else String.prototype.format = format;

})();
