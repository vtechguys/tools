const cron = require('node-cron');
const fs = require("fs");
const path = require("path");

function deleteCompressedFiles(){
    cron.schedule('0 2 * * *', () => {

        const directoryPathCompress = path.join(__dirname, '../tempImg', 'compress');
        //passsing directoryPath and callback function
        fs.readdir(directoryPathCompress, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                fs.unlink(file); 
            });
        });
        const directoryPathUploads = path.join(__dirname, '../tempImg', 'compress');
        fs.readdir(directoryPathUploads, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                fs.unlink(file); 
            });
        });
        console.log("paths", directoryPathCompress);
    }, {
      scheduled: true,
      timezone: "America/Sao_Paulo"
    });
}
function deleteUploadedFiles(){
    cron.schedule('0 1 * * *', () => {
        const directoryPathUploads = path.join(__dirname, '../tempImg', 'uploads');
        fs.readdir(directoryPathUploads, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                fs.unlink(file); 
            });
        });
        console.log("paths", directoryPathCompress);
    }, {
      scheduled: true,
      timezone: "America/Sao_Paulo"
    });
}
module.exports = {
    deleteCompressedFiles,
    deleteUploadedFiles
};