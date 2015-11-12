
function processImage (img) {
  // img.height, .width, .data [r,g,b,a,r,g,b,a...]
  //copy(img)
  //transparent(img);
  //tintRed(img);
  //foo(greyscale(img), greyscale2(img));
  //greyscale(img);
  //invertColors(img);
  //flipVertical(img);
  //rotate90(img);
  flipHorizontal(img);

  /*
  var pixels = genPixels(img);
  console.log(pixels[127]);
  img.data = renderPixels(pixels);
  */

  //greyscale(img);

  /*
  Object.keys(img).forEach(function(i, v) {
    console.log(i);
    console.log(v);
    console.log(img[i]);
  });
  */
}

var img = {
  width: 2,
  height: 2,
  data: [
    1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16,
  ]
}

function flipHorizontal (img) {

  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width / 2; x++) {
      var newX = img.width - x - 1;

      for (var i = 0; i < 4; i++) {
        var currIndex = (y * img.width + x) * 4 + i;
        var swapIndex = (y * img.width + newX) * 4 + i;

        var swap = img.data[swapIndex];
        img.data[swapIndex] = img.data[currIndex];
        img.data[currIndex] = swap;
      }
    }
  }

  return img;
}

//console.log(flipHorizontal(img));

/*
Go through the top left quadrant of the grid (width / 2, height / 2)

For each pixel, perform a rotation:

1. Get the x and y of the current pixel.
newX = height - oldY
newY = oldX
*/
function rotate90 (img) {
  for (var i = 0; i < (img.height / 2); i++) {
    for (var ii = 0; ii < (img.width / 2); ii++) {
      var start = (i * (img.width * 4)) + (ii * 4);

      var rgba = [
        img.data[start],
        img.data[start + 1],
        img.data[start + 2],
        img.data[start + 3]
      ]

      var oldY = i;
      var oldX = ii;

      for (var x = 0; x < 4; x++) {
        var newX = (img.height - 1) - oldY;
        var newY = oldX;
        var swapStart = (newY * (img.width * 4)) + (newX * 4);

        var swap = [];

        for (var s = 0; s < 4; s++) {
          swap.push(img.data[swapStart + s]);
          img.data[swapStart + s] = rgba[s];
        }

        rgba = swap;
        oldX = newX;
        oldY = newY;
      }
    }
  }

  return img;
}

/*
Go through every rgba in the first half, using rows.
*/
function flipVertical (img) {
  for (var i = 0; i < (img.height / 2); i++) {
    for (var ii = 1; ii <= img.width; ii++) {
      for (var iii = 1; iii <= 4; iii++) {
        var swapHeight = img.height - i;
        var x = img.data[(i * img.width * 4) + (ii * 4) - iii];
        var y = img.data[(swapHeight * img.width * 4) + (ii * 4) - iii];

        img.data[(i * img.width * 4) + (ii * 4) - iii] = y;
        img.data[(swapHeight * img.width * 4) + (ii * 4) - iii] = x;
      }
    }
  }
  return img;
}

// Using constants from http://stackoverflow.com/q/687261/886596
function greyscale (img) {
  var f = function(pixel) {
    var c = (0.2989 * pixel['r']) + (0.5870 * pixel['g']) + (0.114 * pixel['b']);

    pixel['r'] = c;
    pixel['g'] = c;
    pixel['b'] = c;

  }

  return mapPixels(img, f);
}

function invertColors (img) {
  var f = function(pixel) {
    pixel['r'] = 255 - pixel['r'];
    pixel['g'] = 255 - pixel['g'];
    pixel['b'] = 255 - pixel['b'];
  };

  return mapPixels(img, f);
}

/*
Given an rgb, push it into a foursome. If the foursome's length is 4,
create a pixel.

Create an array of length 128. Whenever this array is filled, push it
into a master array and create a new array.

*/
function mapPixels(img, f) {
  var foursome = [];

  for (var i = 0; i < img.data.length; i++) {
    foursome.push(img.data[i]);
    if (foursome.length === 4) {
      var pixel = {
        r: foursome[0],
        g: foursome[1],
        b: foursome[2],
        a: foursome[3],
      };

      if (f) {
        f(pixel);
      }

      img.data[i - 3] = pixel['r'];
      img.data[i - 2] = pixel['g'];
      img.data[i - 1] = pixel['b'];
      img.data[i] = pixel['a'];

      foursome = [];
    }
  }

  return img;
}

function copy (img) {
  return img;
}

function transparent (img) {
  for (var i = 0; i < img.data.length; i++) {
    if ((i + 1) % 4 === 0) {
      img.data[i] = 0;
    }
  }

  return img;
}

function tintRed (img) {
  var one = 1;
  var four = 3;

  for (var i = 0; i < img.data.length; i++) {
    one -= 1;
    four -= 1;

    if (one === 0) {
      one = 4;
      if (img.data[i] < 205) {
        img.data[i] += 50;
      }
    } else if (four === 0) {
      four = 4;
      if (img.data[i] < 205) {
        img.data[i] += 50;
      }
    }
  }

  return img;
}

function blur (img, blurFactor) {}




// DON'T MESS WITH WHAT'S BELOW

var fs = require('fs')
var path = require('path')
Png = require('node-png').PNG;

var date = Date.now();

//var inputFilePath = path.join(__dirname,'images','rainbowSheep.png')
//var outputFilePath = path.join(__dirname,'images','out',Date.now()+'.png')
var inputFilePath = './images/rainbowSheep.png'
//var inputFilePath = './images/thing.png'
var outputFilePath = './images/out/' + String(date) + '.png'

fs.createReadStream(inputFilePath)
.pipe(new Png({
  filterType: 4
}))
.on('parsed', function() {
  processImage(this)
  this.pack().pipe(fs.createWriteStream(outputFilePath));
});
