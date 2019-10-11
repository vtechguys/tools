

const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const fs = require("fs");
const utils = require("./utils");

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {

        const FILE_NAME = req.file.filename;

        const FOLDER_PATH = path.join(__dirname, "public", "uploads");
        const FOLDER_SAVE_PATH = path.join(__dirname, "public", "compress");
        try{
          utils.minifyImages(FILE_NAME, FOLDER_PATH, FOLDER_SAVE_PATH);
        }
        catch(e){
          console.log(e);
        }
        
        

        const renderOptions =  {
          msg: `File Uploaded and is being compressed`,
          file: utils.fullUrl(req)+ `/compress/${FILE_NAME}`,
        };
        console.log(renderOptions)
        res.render('index', renderOptions);
      }
    }
  });
});




const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));




// cron task
const CRON_TASK = require("./cron");




CRON_TASK.deleteCompressedFiles();
CRON_TASK.deleteUploadedFiles();