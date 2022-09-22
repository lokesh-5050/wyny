var express = require("express");
var router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const passport = require("passport");
const localStrategy = require("passport-local")
const userModel = require("../models/users")
passport.use(new localStrategy({usernameField:'email'}, userModel.authenticate()))
const {
  homepage,
  adminHomepage,
  menu,
  foodItems,
  cart,
  loginpage,
  createUser,
  pass_authen,
  addToCart
} = require("../controllers/indexcontroller.js");

//clouinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

//cloudinary code
cloudinary.config({
  cloud_name: "dkhzlhxum",
  api_key: "748552462825973",
  api_secret: "rTX3Ad4uthlqjFS6GayHhUwKv_Q",
});
const upload = multer({ storage: storage });



/* @api  login page. */
router.get("/", loginpage);

/* @api  createUser page. */
router.post("/create", createUser);

/* @api  login form req. */
router.post("/login", pass_authen);

/* @api  home page. */
router.get("/homepage", homepage);

/* @api admin homepage. */
router.get("/admin", adminHomepage);

/* @api menu page. */
router.get("/menu", menu);


/* @api cart page. */
router.get("/cart", cart);

/* @api starter-menu. */
router.post("/starter-menu", upload.single("myFile"), foodItems);

router.get("/addToCart/:foodId" , addToCart)

module.exports = router;
