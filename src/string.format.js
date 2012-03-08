/*
 *
  string.format - 0.1
  https://github.com/h3/string.format.js
  
  (c) Maxime Haineault <max@motion-m.ca>
  http://motion-m.ca - http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  JavaScript implementation of Python Advanced String Formatting
  http://www.python.org/dev/peps/pep-3101/

*/

(function(){

    var arguments2Array = function(args, shift) {
        /* Converts regular JavaScript arguments to a
         * real JavaScript Array object.
         */
        var o = [];
        for (l=args.length, x=(shift || 0); x<l;x++) { o.push(args[x]); }
        return o;
    };
    
    var Argument = function(arg, args) {
        /* A manager for string format arguments.
         */
        this.__arg  = arg;
        this.__args = args;
        this.__max_precision = parseFloat('1.'+ (new Array(32)).join('1'), 10).toString().length-3;
        this.__def_precision = 6;
        this.getString = function(){
            return this.__arg;
        };
        this.getKey = function(){
            return this.__arg.split(':')[0];
        };
        this.getFormat = function(){
            var match = this.getString().split(':');
            return (match && match[1])? match[1]: 's';
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
                else { return this.__def_precision; }
            }
        };
        this.getPaddingLength = function(){
            var match = false;
            if (this.isAlternate()) {
                match = this.getString().match(/0?#0?(\d+)/);
                if (match && match[1]) { return parseInt(match[1], 10); }
            }
            match = this.getString().match(/(0|\.)(\d+|\*)/g);
            return match && parseInt(match[0].slice(1), 10) || 0;
        };
        this.getPaddingString = function(){
            var o = '';
            if (this.isAlternate()) { o = ' '; }
            // 0 take precedence on alternate format
            if (this.getFormat().match(/#0|0#|^0|\.\d+/)) { o = '0'; }
            return o;
        };
        this.getFlags = function(){
            var match = this.getString().matc(/^(0|\#|\-|\+|\s)+/);
            return match && match[0].split('') || [];
        };
        this.isAlternate = function() {
            return !!this.getFormat().match(/^0?#/);
        };
    };

    var strConversion = {
        // tries to translate any objects type into string gracefully
        __repr: function(i){
            switch(this.__getType(i)) {
                case 'array':case 'date':case 'number':
                    return i.toString();
                case 'object': // Thanks to Richard Paul Lewis for the fix
                    var o = []; 
                    var l = i.length;
                    for(var x=0;x<l;x++) {
                      o.push(x+': '+this.__repr(i[x]));
                    } 
                    return o.join(', ');                        
                case 'string': 
                    return i;
                default: 
                    return i;
            }
        },
        // like typeof but less vague
        __getType: function(i) {
            if (!i || !i.constructor) { return typeof(i); }
            var match = i.constructor.toString().match(/Array|Number|String|Object|Date/);
            return match && match[0].toLowerCase() || typeof(i);
        },
        // Jonas Raoni Soares Silva (http://jsfromhell.com/string/pad)
        __pad: function(str, l, s, t){
            var p = s || ' ';
            var o = str;
            if (l - str.length > 0) {
                o = new Array(Math.ceil(l / p.length)).join(p).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2)) + str + p.substr(0, l - t);
            }
            return o;
        },
        __getInput: function(arg, args) {
             var key = arg.getKey();
            switch(this.__getType(args)){
                case 'object': // Thanks to Jonathan Works for the patch
                    var keys = key.split('.');
                    var obj = args;
                    for(var subkey = 0; subkey < keys.length; subkey++){
                        obj = obj[keys[subkey]];
                    }
                    if (typeof(obj) != 'undefined') {
                        if (strConversion.__getType(obj) == 'array') {
                            return arg.getFormat().match(/\.\*/) && obj[1] || obj;
                        }
                        return obj;
                    }
                    else {
                        // TODO: try by numerical index                    
                    }
                break;
                case 'array': 
                    key = parseInt(key, 10);
                    if (arg.getFormat().match(/\.\*/) && typeof args[key+1] != 'undefined') { return args[key+1]; }
                    else if (typeof args[key] != 'undefined') { return args[key]; }
                    else { return key; }
                break;
            }
            return '{'+key+'}';
        },
        __formatToken: function(token, args) {
            var arg   = new Argument(token, args);
            return strConversion[arg.getFormat().slice(-1)](this.__getInput(arg, args), arg);
        },

        // Signed integer decimal.
        d: function(input, arg){
            var o = parseInt(input, 10); // enforce base 10
            var p = arg.getPaddingLength();
            if (p) { return this.__pad(o.toString(), p, arg.getPaddingString(), 0); }
            else   { return o; }
        },
        // Signed integer decimal.
        i: function(input, args){ 
            return this.d(input, args);
        },
        // Unsigned octal
        o: function(input, arg){ 
            var o = input.toString(8);
            if (arg.isAlternate()) { o = this.__pad(o, o.length+1, '0', 0); }
            return this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(), 0);
        },
        // Unsigned decimal
        u: function(input, args) {
            return Math.abs(this.d(input, args));
        },
        // Unsigned hexadecimal (lowercase)
        x: function(input, arg){
            var o = parseInt(input, 10).toString(16);
            o = this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(),0);
            return arg.isAlternate() ? '0x'+o : o;
        },
        // Unsigned hexadecimal (uppercase)
        X: function(input, arg){
            return this.x(input, arg).toUpperCase();
        },
        // Floating point exponential format (lowercase)
        e: function(input, arg){
            return parseFloat(input, 10).toExponential(arg.getPrecision());
        },
        // Floating point exponential format (uppercase)
        E: function(input, arg){
            return this.e(input, arg).toUpperCase();
        },
        // Floating point decimal format
        f: function(input, arg){
            return this.__pad(parseFloat(input, 10).toFixed(arg.getPrecision()), arg.getPaddingLength(), arg.getPaddingString(),0);
        },
        // Floating point decimal format (alias)
        F: function(input, args){
            return this.f(input, args);
        },
        // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
        g: function(input, arg){
            var o = parseFloat(input, 10);
            return (o.toString().length > 6) ? Math.round(o.toExponential(arg.getPrecision())): o;
        },
        // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
        G: function(input, args){
            return this.g(input, args);
        },
        // Single character (accepts integer or single character string). 	
        c: function(input, args) {
            var match = input.match(/\w|\d/);
            return match && match[0] || '';
        },
        // String (converts any JavaScript object to anotated format)
        r: function(input, args) {
            return this.__repr(input);
        },
        // String (converts any JavaScript object using object.toString())
        s: function(input, args) {
            return input.toString && input.toString() || ''+input;
        }
    };

    var format = function() {
        var end    = 0;
        var start  = 0;
        var match  = false;
        var buffer = [];
        var token  = '';
        var str    = this;
        var args   = arguments[0];
        var tmp    = (str||'').split('');
        for(start=0; start < tmp.length; start++) {
            if (tmp[start] == '{' && tmp[start+1] !='{') {
                end   = str.indexOf('}', start);
                token = tmp.slice(start+1, end).join('');
                if (tmp[start-1] != '{' && tmp[end+1] != '}') {
                    var tokenArgs = (typeof args != 'object')? arguments2Array(arguments): args || [];
                    buffer.push(strConversion.__formatToken(token, tokenArgs));
                }
                else {
                    buffer.push(token);
                }
            }
            else if (start > end || buffer.length < 1) { buffer.push(tmp[start]); }
        }
        return (buffer.length > 1)? buffer.join(''): buffer[0];
    };

    String.prototype.format = format;
    // jQuery
    //$.extend(strings);
})();
