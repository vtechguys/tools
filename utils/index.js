const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

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

async function compressImages(fileName, pathToFolder = "public/uploads", finalFolderName = "public/compress", qualityX = 0.6, qualityY = 0.8){
    console.log(`> ${pathToFolder}/${fileName}`);
    console.log("<", finalFolderName);
    try{
        await imagemin([`${pathToFolder}/${fileName}`], {
            destination: finalFolderName,
            plugins: [
                imageminJpegtran({
                    quality: [qualityX, qualityY]
                }),
                imageminPngquant({
                    quality: [qualityX, qualityY]
                })
            ]
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