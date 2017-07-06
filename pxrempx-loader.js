var loaderUtils = require('loader-utils');
var regxMaster = require('regx-master');

var globalFilter = null;
var rgxCSS = regxMaster(/[:css:]|([:pxrem:])/g, {
    pxrem: /\b([\d+\.]+)(?:px|rem)\b/,
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

        var a = s.match(/(.+)(px|rem)$/);
        if (a[2] === 'px') {
            var rem = (+a[1] / root).toFixed(fixed).replace(/\.?[0]+$/, '');
            return rem + 'rem';
        };

        return rempx ? a[1] + 'px' : s;
    });
};
