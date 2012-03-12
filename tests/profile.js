var newRow, profile, profiles, st, rt, runner;
var iterations = [1, 2, 10, 100, 1000];


newRow = function(name, count, runtime) {
    $(['<tr>',
           '<td>', name ,'</td>',
           '<td>', count ,'</td>',
           '<td>', runtime ,'ms</td>',
        '</tr>'
    ].join('')).appendTo('#profile-results tbody');
};

profile = function(name, func, count) {
    st = new Date();
    for (x=count;x>0;x--) func.call();
    rt = +new Date() - st;
    newRow(name, count, rt)
};

runner = function(name, str, replace, iterations) {
    $.each(iterations, function(i, val){
        profile(name, function(){ str.format(replace); }, val);
        name = '';
    });

};

textblock = function(len, suffix) {
    var o = [];
    var words = "lorem,ipsum,dolor,sit,amet,consectetur,adipiscing,elit,praesent,hendrerit,tortor,dolor".split(',');
    while (o.length < len) {
        o.push(words[Math.floor(Math.random() * words.length)])
    }
    if (suffix) o.push(suffix);
    return o.join(' ');
};
