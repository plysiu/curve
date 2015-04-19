'strict mode';
var lerp = require('lerp'),
    interpolatingPolynomial = require('interpolating-polynomial');

exports.linear = function (data, fitCount) {
    var newData = new Array();
    var springFactor = new Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0]; // for new allocation
    for (var i = 1; i < fitCount - 1; i++) {
        var tmp = i * springFactor,
            before = new Number(Math.floor(tmp)).toFixed(),
            after = new Number(Math.ceil(tmp)).toFixed(),
            atPoint = tmp - before;
        newData[i] = lerp(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1]; // for new allocation
    return newData;
};

exports.polynomial = function (data, fitCount) {
    var d = [],
        newData = [],
        step = data.length / fitCount;
    for (var i = 0; i < data.length; i++) {
        d.push([i, data[i]]);
    }
    var f = interpolatingPolynomial(d);
    for (var i = 0; i < fitCount; i++) {
        newData[i] = f(i * step);
    }
    return newData;
};
