'strict mode'
var fs = require('fs'),
    upsampling = require('./upsampling'),
    hilbert = require('./hilbert'),
    inputArray = JSON.parse(fs.readFileSync('input.json')),
    Canvas = require('canvas'),
    Color = require("color");
/**
 * Get lenght of longest array
 * @param inputArray
 * @returns {number}
 */
getLengthOfTheLongestArray = function (inputArray) {
    var max = 0;
    for (var item in inputArray) {
        if (inputArray[item].length > 0) {
            max = inputArray[item].length;
        }
    }
    return max;
};
/**
 *
 * @param value
 * @returns {number}
 */
getMaximumNumberOfElementsToFillCanvasWithHilbertCurve = function (value) {
    return Math.pow(4, Math.ceil(Math.log(value, 4)));
};
/**
 *
 * @param value
 * @returns {number}
 */
getCanvasSize = function (value) {
    return {x: Math.sqrt(value), y: Math.sqrt(value)};
};
/**
 * Saving canvas
 * @param item
 * @param canvas
 */
saveCanvasToFile = function (name, canvas) {
    console.log('Image ./images/' + item + '.png Saving...');
    var out = fs.createWriteStream('./images/' + name + '.png'),
        stream = canvas.createPNGStream();
    stream.on('data', function (chunk) {
        out.write(chunk);
    });
    stream.on('end', function () {
        console.log('Image ./images/' + name + '.png saved!');
    });
};

var hilbertEelements = getMaximumNumberOfElementsToFillCanvasWithHilbertCurve(getLengthOfTheLongestArray(inputArray));
var canvasSize = getCanvasSize(hilbertEelements);
/**
 * Painting configuration
 * @type {{height: number, width: number}}
 */
var dot = {
    height: 1,
    width: 1
};

/**
 * Upsampling
 */
var upsampledArray = {linear: [], polynomial: []};
console.log('UPSAMPLING');
for (var item in inputArray) {
    upsampledArray['linear'][item] = upsampling.linear(inputArray[item], hilbertEelements);
    upsampledArray['polynomial'][item] = upsampling.polynomial(inputArray[item], hilbertEelements);
}
/**
 * MAGIC
 */
console.log('DRAWING');

for (var type in upsampledArray) {
    for (var item in upsampledArray[type]) {


        var canvas = new Canvas(dot.width * canvasSize.x, dot.height * canvasSize.y),
            ctx = canvas.getContext('2d'),
            point,
            color = Color();

        for (var i = 0; i < upsampledArray[type][item].length; i++) {


            if (i % 64 == 0) {
                console.log('pic', i, type, item);
            }

            point = hilbert.d2xy(upsampledArray[type][item].length, i);

            color.rgb(255, 255, 255).darken(upsampledArray[type][item][i]);
            ctx.fillStyle = color.hexString();
            ctx.fillRect(point.x * dot.width, point.y * dot.height, dot.width, dot.height);
            //console.log(type, item, i, point, color.hexString(), upsampledArray[type][item][i]);
        }
        saveCanvasToFile(type + '-' + item, canvas);
    }
}
//var f, x;
//f = interpolatingPolynomial([[-2, 2],
//    [-1, -0.5],
//    [0, 0.5],
//    [1.5, -1.5]]);
//
//for (x = -2; x < 2; x += 0.000001) {
//    console.log(x, f(x));
//}
