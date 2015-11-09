var keys = ['r', 'g', 'b', 'a'];

function processImage (img) {
  // img.height, .width, .data [r,g,b,a,r,g,b,a...]
  //copy(img)
  //transparent(img);
  //tintRed(img);
  //greyscale(img);
  //invertColors(img);
  /*
  var pixels = genPixels(img);
  console.log(pixels[127]);
  img.data = renderPixels(pixels);
  */

  greyscale(img);

  /*
  Object.keys(img).forEach(function(i, v) {
    console.log(i);
    console.log(v);
    console.log(img[i]);
  });
  */
}

// Using constants from http://stackoverflow.com/q/687261/886596
function greyscale (img) {
  var f = function(pixel) {
    pixel['r'] = 0.2989 * pixel['r'];
    pixel['g'] = 0.5870 * pixel['g'];
  }
}

function invertColors (img) {
  var f = function(pixel) {
    pixel['r'] = 255 - pixel['r'];
    pixel['g'] = 255 - pixel['g'];
    pixel['b'] = 255 - pixel['b'];
  };

  img.data = renderPixels(genPixels(img, f));

  return img;
}

/*
Given an rgb, push it into a foursome. If the foursome's length is 4,
create a pixel.

Create an array of length 128. Whenever this array is filled, push it
into a master array and create a new array.

*/
function genPixels(img, f) {
  var pixels = [];
  var foursome = [];

  var row = [];
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

      row.push(pixel);
      foursome = [];
      if (row.length === img.width) {
        pixels.push(row);
        row = [];
      }
    }
  }

  return pixels;
}

function renderPixels(pixels) {
  var raw = [];

  pixels.forEach(function(row) {
    row.forEach(function(pixel) {

      keys.forEach(function(k) {
        raw.push(pixel[k]);
      });

    });
  });

  return raw;
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





function flipVertical (img) {
  var news = [];

  img.data = news;
  return img;
}

function flipHorizontal (img) {}

function rotate90 (img) {}

function blur (img, blurFactor) {}




// DON'T MESS WITH WHAT'S BELOW

var fs = require('fs')
var path = require('path')
Png = require('node-png').PNG;

var date = Date.now();

//var inputFilePath = path.join(__dirname,'images','rainbowSheep.png')
//var outputFilePath = path.join(__dirname,'images','out',Date.now()+'.png')
var inputFilePath = './images/rainbowSheep.png'
var outputFilePath = './images/out/' + String(date) + '.png'

fs.createReadStream(inputFilePath)
.pipe(new Png({
  filterType: 4
}))
.on('parsed', function() {
  processImage(this)
  this.pack().pipe(fs.createWriteStream(outputFilePath));
});
