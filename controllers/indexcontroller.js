const passport = require("passport");
const foodModel = require("../models/food");
const userModel = require("../models/users");
const cartModel = require("../models/cart");

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
  })
  userModel.register(newUser, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/")
    })
  })

};

exports.pass_authen = passport.authenticate("local", {
  successRedirect: "/homepage",
  failureRedirect: "/"
}), function (req, res, next) {

}



exports.homepage = (req, res, next) => {
  const user = req.user.username
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
  const foodItems = await foodModel.find();
  console.log(foodItems + "  showed foodItems");
  // var allIds = ""
  // for (let index = 0; index < foodItems.length; index++) {
  //    allIds += foodItems[index]._id
  // }
  // console.log(allIds );
  // const splittedIds = allIds.match(/.{1,24}/g)
  // console.log(splittedIds);
  

  
  res.render("menu", { foodItems });
 
};

//checkIsInCart
exports.checkIsInCart = async (req, res, next) => {
  let loggedInUser = await userModel.findById(req.user._id)
  console.log(loggedInUser + "[][loggedInUser");
  console.log(req.params.foodId1);

  // let foodIdInfo1Data = await loggedInUser.foodId.includes(req.params.foodId1)
  // let foodIdInfo2Data = await loggedInUser.foodId.includes(req.params.foodId2)
  // let foodIdInfo3Data = await loggedInUser.foodId.includes(req.params.foodId3)
  // let foodIdInfo4Data = await loggedInUser.foodId.includes(req.params.foodId4)
  // let foodIdInfo5Data = await loggedInUser.foodId.includes(req.params.foodId5)
  // let foodIdInfo6Data = await loggedInUser.foodId.includes(req.params.foodId6)
  // let foodIdInfo7Data = await loggedInUser.foodId.includes(req.params.foodId7)


  if(loggedInUser.foodId.includes(req.params.foodId1) || loggedInUser.foodId.includes(req.params.foodId2) ||loggedInUser.foodId.includes(req.params.foodId3) ||loggedInUser.foodId.includes(req.params.foodId4) || loggedInUser.foodId.includes(req.params.foodId5) ||loggedInUser.foodId.includes(req.params.foodId6) ||loggedInUser.foodId.includes(req.params.foodId7)){
    res.json("includes")
  }else{
    res.json("notincludes") 
  }

}


exports.cart = async (req, res, next) => {
  try {
    var user = await userModel.findOne({ _id: req.user.id }).populate({
      path: "cart",
      populate: {
        path: "foods"
      }
    })



    //for cartTotal Amount 
    var tot = 0
    for (let index = 0; index < user.cart.length; index++) {
      tot += user.cart[index].foods.price * user.cart[index].quan

    }

    //for item total along with quantity
    var itemTot = "0"
    for (let index = 0; index < user.cart.length; index++) {
      itemTot = user.cart[index].foods.price * user.cart[index].quan

    }

    // res.json(user)
    res.render("cart", { user, tot, itemTot })

  } catch (err) {
    // res.sendStatus(404).json("err" + err);
    console.error(err)
  }
};


//addToCart API function 
exports.addToCart = async (req, res, next) => {
  try {
    var loggedInUser = await userModel.findOne({ _id: req.user.id }).populate("cart")
    // res.json(loggedInUser.cart)
    if (loggedInUser.foodId.includes(req.params.foodId)) {
      console.log("yes it includes");
      // console.log(loggedInUser.cart.quantity);
      res.redirect("/cart")
      res.json("already added")
    } else {
      console.log("not includes");
      const addedToCart = await cartModel.create({
        foods: req.params.foodId,
      })

      loggedInUser.foodId.push(req.params.foodId)
      loggedInUser.cart.push(addedToCart._id)
      let seeUsersCart = await loggedInUser.save()
      console.log(seeUsersCart + ".....seeUsersCart");
      res.redirect("back")
      res.json("added")
    }

  } catch (err) {
    console.error(err)
  }
};


exports.incItem = async (req, res, next) => {
  await cartModel.findByIdAndUpdate({ _id: req.params.cartId }, { $inc: { quan: 1 } })
  res.redirect("back")
}

exports.decItem = async (req, res, next) => {
  let loggedInUser = await userModel.findOne({ _id: req.user._id })
  let thisCart = await cartModel.findById(req.params.cartId)

  if (thisCart.quan === 1) {

    let indexOfcartId = await loggedInUser.cart.indexOf(req.params.cartId)
    let indexOfFoodId = await loggedInUser.foodId.indexOf(req.params.foodId)
    loggedInUser.cart.splice(indexOfcartId, 1)
    loggedInUser.foodId.splice(indexOfFoodId, 1)
    const removedIds = await loggedInUser.save()
    console.log(removedIds + "THE IDS ARE REMOVED SUCCESSFULLY");
    res.redirect(req.headers.referer)
    console.log("in hrerrerererereer");

  } else {
    await cartModel.findByIdAndUpdate({ _id: req.params.cartId }, { $inc: { quan: -1 } })
    res.redirect("/cart")

  }

  // let indexOfFoodId = await loggedInUser.foodId.indexOf(req.params.foodId)
  // let indexOfcartId = await loggedInUser.cart.indexOf(req.params.cartId)
  // console.log(indexOfFoodId + ".././. indecOfFoodId");
  // const foodIdDeleted = await loggedInUser.foodId.splice(req.params.foodId, indexOfFoodId)
  // // console.log(foodIdDeleted + ".././. indecOfFoodId");

  // const cartIdDeleted = await loggedInUser.cart.splice(req.params.cartId, indexOfcartId)
  // // console.log(foodIdDeleted + "\\\\foodIdDeleted");
  // // console.log(cartIdDeleted + "\\\\foodIdDeleted");
  // const foodIdRemoved = await loggedInUser.save()
  // console.log(foodIdRemoved + " THE FOOD&CART ID IS SUCCESSFULLY REMOVED ");
  // await cartModel.findByIdAndUpdate({ _id: req.params.cartId }, { $inc: { quan: -1 } })
  // res.redirect("back")
  // await cartModel.findByIdAndUpdate({ _id: req.params.cartId }, { $inc: { quan: -1 } })
  // res.redirect("/cart")
}








