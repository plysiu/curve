'strict mode'
upsampling = require('./upsampling'),
    fs = require('fs'),
    hilbert = require('./hilbert'),
    Canvas = require('canvas'),
    Color = require("color");
/**
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
 * Painting configuration
 * @type {{height: number, width: number}}
 */
var dot = {
    height: 1,
    width: 1
};
var create = function (data, canvasSize, res) {


    var canvas = new Canvas(dot.width * canvasSize.x, dot.height * canvasSize.y),
        ctx = canvas.getContext('2d');

console.log(data.length);
    for (var i = 0; i < data.length; i++) {

        var point = hilbert.d2xy(data.length, i);
        ctx.fillStyle = Color().rgb(255, 255, 255).darken(data[i]).hexString();
        ctx.fillRect(point.x * dot.width, point.y * dot.height, dot.width, dot.height);
    }

    saveCanvasToFile = function (name, canvas) {
        var out = fs.createWriteStream('./public/images/' + name + '.png'),
            stream = canvas.createPNGStream();
        stream.on('data', function (chunk) {
            out.write(chunk);
        });
        stream.on('end', function () {
            res.json({content: time});
        });
    };
    var time = Date.now();
    saveCanvasToFile(time, canvas);
    //res.json({content: time});
//    res.writeHead(200, {'Content-Type': 'image/png'});
    //  res.end(canvas.toBuffer());
};

//for (var type in upsampledArray) {
//    for (var item in upsampledArray[type]) {
//
//
//        var canvas = new Canvas(dot.width * canvasSize.x, dot.height * canvasSize.y),
//            ctx = canvas.getContext('2d'),
//            point,
//            color = Color();
//
//        for (var i = 0; i < upsampledArray[type][item].length; i++) {
//
//            if (i % 64 == 0) {
//                console.log('pic', i, type, item);
//            }
//            point = hilbert.d2xy(upsampledArray[type][item].length, i);
//
//            color.rgb(255, 255, 255).darken(upsampledArray[type][item][i]);
//            ctx.fillStyle = color.hexString();
//            ctx.fillRect(point.x * dot.width, point.y * dot.height, dot.width, dot.height);
//            //console.log(type, item, i, point, color.hexString(), upsampledArray[type][item][i]);
//        }
//        saveCanvasToFile(type + '-' + item, canvas);
//    }
//}
//var f, x;
//f = interpolatingPolynomial([[-2, 2],
//    [-1, -0.5],
//    [0, 0.5],
//    [1.5, -1.5]]);
//
//for (x = -2; x < 2; x += 0.000001) {
//    console.log(x, f(x));
//}


var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));


app.post('/send', function (req, res) {
    console.log(req.body.content.length, getMaximumNumberOfElementsToFillCanvasWithHilbertCurve(req.body.content.length));


    create(upsampling.linear(req.body.content, getMaximumNumberOfElementsToFillCanvasWithHilbertCurve(req.body.content.length)),
        getCanvasSize(getMaximumNumberOfElementsToFillCanvasWithHilbertCurve(req.body.content.length)),
        res);
});


app.listen(process.env.PORT || 3000, function () {
    console.log('SERVER listening')
});

