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
  checkIsInCart,
  loginpage,
  createUser,
  pass_authen,
  addToCart,
  incItem,
  decItem,
  orderPage,
  order
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

/* @api checkIsInCart . */
router.get("/checkIsInCart/:foodId1/:foodId2/:foodId3/:foodId4/:foodId5/:foodId6/:foodId7", checkIsInCart);

/* @api starter-menu. */
router.post("/starter-menu", upload.single("myFile"), foodItems);

router.get("/addToCart/:foodId" , addToCart)


//incItem
router.get("/incItem/:cartId" , incItem)

//decItem
router.get("/decItem/:cartId/:foodId" , decItem)


//address Fill page!!
router.get("/orderPage" , orderPage)

//address Fill page!!
router.post("/order" , order)




module.exports = router;
