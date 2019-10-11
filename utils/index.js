const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminWebp = require('imagemin-webp');




const fs = require("fs");
const path = require("path");

const url = require('url');

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    // pathname: req.originalUrl
  });
}

async function compressImages(fileName, pathToFolder = "tempImg/uploads", finalFolderName = "tempImg/compress", qualityMin = 0.3, qualityMax = 0.5){
    console.log(`> ${pathToFolder}/${fileName}`);
    console.log("<", finalFolderName);
    let plugins = [
        imageminWebp({
            quality: qualityMin * 100
        }),
    ];
 
    if(fileName.includes(".jpeg")|| fileName.includes(".jpg") ){
        plugins = [
            imageminMozjpeg({
                quality: ( qualityMin * 100 )
            }),
            imageminJpegtran()
        ];
    }
    else if(fileName.includes(".png")){
        plugins = [
            imageminOptipng({
                optimizationLevel: 5
            }),
            imageminPngquant({
                quality: [qualityMin, qualityMax]
            }),
        ];
    }
    else{
        plugins = [
            imageminWebp({
                quality: qualityMin * 100 * 2
            })

        ];
    }
    try{
        await imagemin([`${pathToFolder}/${fileName}`], {
            destination: finalFolderName,
            plugins: plugins
        });
    }
    catch(e){
        console.log("Error", e);
    }


}



module.exports = {
    minifyImages: compressImages,
    fullUrl,
};