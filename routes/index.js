var express = require('express');
var router = express.Router();
const multer  = require('multer')
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sharp = require("sharp");
const { Readable } = require("stream");

const {   homepage ,
     adminHomepage ,
     menu , starterItems} = require("../controllers/indexcontroller.js")

     //clouinary
     const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "DEV",
      },
    });

  //cloudinary code
  cloudinary.config({ 
    cloud_name: 'dkhzlhxum', 
    api_key: '748552462825973', 
    api_secret: 'rTX3Ad4uthlqjFS6GayHhUwKv_Q' 
  });
  const upload = multer({ storage: storage })

  //to compress the uploaded file
  const bufferToStream = (buffer) => {
    const readable = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    return readable;
  };


/* @api  home page. */
router.get('/', homepage);

/* @api admin homepage. */
router.get('/admin', adminHomepage);


/* @api menu page. */
router.get('/menu', menu);

/* @api starter-menu. */
router.post('/starter-menu', upload.single("myFile") , starterItems  );

module.exports = router;
