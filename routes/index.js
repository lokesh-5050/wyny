var express = require("express");
var router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("../models/users");
passport.use(
  new localStrategy({ usernameField: "email" }, userModel.authenticate())
);
const {
  homepage,
  adminHomepage,
  menu,
  foodItems,
  cart,
  // checkIsInCart,
  loginpage,
  createUser,
  pass_authen,
  addToCart,
  incItem,
  decItem,
  orderPage,
  order,
  createOrderId,
  likeThis,
  comeBackToHere
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

// //RazorPay
// const Razorpay = require('razorpay');
// var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET })

// var options = {
//   amount: 50000,  // amount in the smallest currency unit
//   currency: "INR",
//   receipt: "order_rcptid_11"
// };
// instance.orders.create(options, function(err, order) {
//   console.log(order);
// });

router.post("/api/payment/verify", (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { signatureIsValid: "true" };
  res.send(response);
});



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
// router.get("/checkIsInCart/:foodId1/:foodId2/:foodId3/:foodId4/:foodId5/:foodId6/:foodId7", checkIsInCart);

/* @api starter-menu. */
router.post("/starter-menu", upload.single("myFile"), foodItems);

router.get("/addToCart/:foodId", addToCart);

//incItem
router.get("/incItem/:cartId", incItem);

//decItem
router.get("/decItem/:cartId/:foodId", decItem);

//address Fill page!!
router.get("/orderPage", orderPage);

//address Fill page!!
router.post("/order", order);

//Api for RazorPay
router.post("/create/orderId", createOrderId);

//like api
router.get("/likes/:id" , likeThis)

router.get("*", comeBackToHere)
module.exports = router;
