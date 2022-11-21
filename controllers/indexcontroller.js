//have to add try catch statement in all exported functions
const passport = require("passport");
const foodModel = require("../models/food");
const userModel = require("../models/users");
const cartModel = require("../models/cart");
const orderModel = require("../models/order");
exports.loginpage = (req, res, next) => {
  res.render("loginpage");
};

exports.createUser = async (req, res, next) => {
  const newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    state: req.body.state,
    city: req.body.city,
    pincode: req.body.pincode,
  });
  userModel.register(newUser, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  });
};

(exports.pass_authen = passport.authenticate("local", {
  successRedirect: "/homepage",
  failureRedirect: "/",
})),
  function (req, res, next) {};

exports.homepage = async (req, res, next) => {
  const user = req.user.username;
  console.log(user);

  res.render("index");
};

exports.adminHomepage = (req, res, next) => {
  res.render("adminHome");
};

//uploading via admin panel
exports.foodItems = async (req, res, next) => {
  try {
    const foodItems = await foodModel.create({
      fimg: req.file.path,
      foodname: req.body.foodname,
      descriptionoffood: req.body.descriptionoffood,
      price: req.body.price,
    });
    console.log(foodItems + " added  foodItems");

    res.redirect(req.headers.referer);
  } catch (err) {
    res.send(404).json("err" + err);
  }
};

//menu page
exports.menu = async (req, res, next) => {
  let user = await userModel.findOne({_id:req.user._id})
  const foodItems = await foodModel.find();
  console.log(foodItems + "  showed foodItems");
  // var allIds = ""
  // for (let index = 0; index < foodItems.length; index++) {
  //    allIds += foodItems[index]._id
  // }
  // console.log(allIds );
  // const splittedIds = allIds.match(/.{1,24}/g)
  // console.log(splittedIds);

  res.render("menu", { foodItems , user });
};

// //checkIsInCart
// exports.checkIsInCart = async (req, res, next) => {
//   let loggedInUser = await userModel.findById(req.user._id);
//   console.log(loggedInUser + "[][loggedInUser");
//   console.log(req.params.foodId1);

//   if (
//     loggedInUser.foodId.includes(req.params.foodId1) ||
//     loggedInUser.foodId.includes(req.params.foodId2) ||
//     loggedInUser.foodId.includes(req.params.foodId3) ||
//     loggedInUser.foodId.includes(req.params.foodId4) ||
//     loggedInUser.foodId.includes(req.params.foodId5) ||
//     loggedInUser.foodId.includes(req.params.foodId6) ||
//     loggedInUser.foodId.includes(req.params.foodId7)
//   ) {
//     res.json("includes");
//   } else {
//     res.json("notincludes");
//   }
// };

exports.cart = async (req, res, next) => {
  try {
    var user = await userModel.findOne({ _id: req.user.id }).populate({
      path: "cart",
      populate: {
        path: "foods",
      },
    });

    //for cartTotal Amount
    var tot = 0;
    for (let index = 0; index < user.cart.length; index++) {
      tot += user.cart[index].foods.price * user.cart[index].quan;
    }

    //for item total along with quantity
    var itemTot = "0";
    for (let index = 0; index < user.cart.length; index++) {
      itemTot = user.cart[index].foods.price * user.cart[index].quan;
    }

    // res.json(user)
    res.render("cart", { user, tot, itemTot });
  } catch (err) {
    // res.sendStatus(404).json("err" + err);
    console.error(err);
  }
};

//addToCart API function
exports.addToCart = async (req, res, next) => {
  try {
    var loggedInUser = await userModel
      .findOne({ _id: req.user.id })
      .populate("cart");
    // res.json(loggedInUser.cart)
    console.log("yes it includes");
    if (loggedInUser.foodId.includes(req.params.foodId)) {
      // console.log(loggedInUser.cart.quantity);
      res.redirect("/cart");
      res.json("already added");
    } else {
      console.log("not includes");
      const addedToCart = await cartModel.create({
        foods: req.params.foodId,
      });

      loggedInUser.foodId.push(req.params.foodId);
      loggedInUser.cart.push(addedToCart._id);
      let seeUsersCart = await loggedInUser.save();
      console.log(seeUsersCart + ".....seeUsersCart");
      res.redirect("back");
      res.json("added");
    }
  } catch (err) {
    console.error(err);
  }
};

exports.incItem = async (req, res, next) => {
  await cartModel.findByIdAndUpdate(
    { _id: req.params.cartId },
    { $inc: { quan: 1 } }
  );
  res.redirect("back");
};

exports.decItem = async (req, res, next) => {
  let loggedInUser = await userModel.findOne({ _id: req.user._id });
  let thisCart = await cartModel.findById(req.params.cartId);

  if (thisCart.quan === 1) {
    let indexOfcartId = await loggedInUser.cart.indexOf(req.params.cartId);
    let indexOfFoodId = await loggedInUser.foodId.indexOf(req.params.foodId);
    loggedInUser.cart.splice(indexOfcartId, 1);
    loggedInUser.foodId.splice(indexOfFoodId, 1);
    const removedIds = await loggedInUser.save();
    console.log(removedIds + "THE IDS ARE REMOVED SUCCESSFULLY");
    res.redirect(req.headers.referer);
    console.log("in hrerrerererereer");
  } else {
    await cartModel.findByIdAndUpdate(
      { _id: req.params.cartId },
      { $inc: { quan: -1 } }
    );
    res.redirect("/cart");
  }
};

exports.orderPage = async (req, res, next) => {
  let allCartItems = await userModel
    .findOne({ _id: req.user._id })
    .populate("cart");
  // var cart = allCartItems.cart;
  res.render("addressPage");
};

exports.order = async (req, res, next) => {
  if (req.body.paymentMode === "COD") {
    let loggedInUser = await userModel.findOne({ _id: req.user._id });

    const newOrder = await orderModel.create({
      user: loggedInUser._id,
      status: "Processing",
    });

    await loggedInUser.order.push(newOrder._id);
    var pushedSucc = await loggedInUser.save();
    var showOrder = await pushedSucc.populate({
      path: "cart",
      populate: {
        path: "foods",
      },
    });
    console.log(showOrder + "[order pushed to user]");
    // res.json(showOrder);

    //total amount to pay for COD
    var codTotAmount = 0;
    // console.log(showOrder.order[0].user[0].cart.length + "///length of cart");
    for (var index = 0; index < showOrder.cart.length; index++) {
      codTotAmount +=
        showOrder.cart[index].foods.price * showOrder.cart[index].quan;
    }
    console.log(codTotAmount);

    res.render("orderplaced" , {showOrder , codTotAmount})
  } else if (req.body.paymentMode === "ONLINE") {
    res.send("online payment razor pay");
  }
};



//like api 
exports.likeThis = async(req,res) =>{
  let postId = req.params.id
  let user = await userModel.findOne({id:req.user._id})

  if(user.likes.includes(postId)){
    user.likes.splice(user.likes.indexOf(postId) , 1)
    await user.save()
    res.redirect("back")
  }else{
    user.likes = [...user.likes , postId]
    await user.save()
    res.redirect("back")

  }
  // res.sendStatus(200).json(user)
}

exports.createOrderId = () =>{
  try {
    const Razorpay = require('razorpay');
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET })
    
    var options = {
      amount: 50000,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {
      console.log(order);
    });
    
  } catch (error) {
    
  }
}


exports.comeBackToHere = (req,res,next) =>{
  res.redirect("/homepage")
}