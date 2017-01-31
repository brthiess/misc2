const screenshot = require('screenshot-desktop')
const fs = require('fs')
var im = require('imagemagick');


screenshot().then((img) => {
	im.crop({
		srcData: img,
		dstPath: 'cropped.jpg',
		width: 800,
		height: 600,
		quality: 1,
		gravity: "NorthWest"
	}, function(err, stdout, stderr){
		// foo
	});
})
.catch((err) => {
  throw err
})
