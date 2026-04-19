var loaderUtils = require('loader-utils');
var regxMaster = require('regx-master');

var globalFilter = null;
var rgxCSS = regxMaster(/[:css:]|([:pxrem:])/g, {
    pxrem: /[\^\:\s\,\(\+\-\*\/](\d+(\.\d+)?|\.\d+)(?:px|rem)\b/,
    css: true
});

module.exports = pxrempxLoader;

function pxrempxLoader(content, map) {
    var options = loaderUtils.getOptions(this) || {};
    var rempx = options.rempx != false; // rem to px
    var fixed = +options.fixed || 8;
    var root = +options.root || 10;

    var filter = typeof options.filter === 'function'
        ? options.filter
        : globalFilter
        ;

    if (filter && filter.call(this, data)) {
        return content;
    };

    return pxrempx('' + content, fixed, root, rempx);
};

pxrempxLoader.setFilter = function(fn) {
    globalFilter = typeof x === 'function' ? fn : null;
};

function pxrempx(data, fixed, root, rempx) {
    var fixed = fixed || 8;
    var root = root || 10;

    return data.replace(rgxCSS, function(s, pxrem) {
        if (!pxrem) {
            return s;
        };
        var a = s.match(/^([^\d\.]+)([\d\.]+)(px|rem)$/);
        if (a[3] === 'px') {
            var rem = (+a[2] / root).toFixed(fixed).replace(/\.?[0]+$/, '');
            return a[1] + (rem + 'rem');
        };
        return rempx ? a[1] + (a[2] + 'px') : s;
    });
};
