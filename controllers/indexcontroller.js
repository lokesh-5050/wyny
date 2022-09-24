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

exports.menu = async (req, res, next) => {
  const foodItems = await foodModel.find();
  console.log(foodItems + "  showed foodItems");
  res.render("menu", { foodItems });
};

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

    // res.json(user)
    res.render("cart", { user , tot })

  } catch (err) {
    // res.sendStatus(404).json("err" + err);
    console.error(err)
  }
};

// exports.addToCart = async (req, res, next) => {
//   try {
//     let loggedInUser = await userModel.findOne({_id:req.user.id})
//       if(loggedInUser.cart.indexOf(req.params.foodId == -1)){

//         const addedToCart = await cartModel.create({
//           foods:req.params.foodId,
//         })

//         loggedInUser.cart.push(addedToCart._id)
//         let seeUsersCart = await loggedInUser.save()
//         console.log(seeUsersCart + ".....seeUsersCart");


//         res.redirect("/cart")
//       }else if(loggedInUser.cart.indexOf(req.params.foodId !== -1)){
//         var quan
//         loggedInUser.cart.quantity = quan++
//         let quanInc = await loggedInUser.save()
//         console.log(quan + " .../././ quanInc 105");
//         res.redirect("/cart")

//       }
//     }catch (err) {
//     console.error(err)
//   }
// };

//addToCart API function 
exports.addToCart = async (req, res, next) => {
  try {
    var loggedInUser = await userModel.findOne({ _id: req.user.id }).populate("cart")
    // res.json(loggedInUser.cart)

   
    
    if(loggedInUser.foodId.includes(req.params.foodId)) {
      console.log("yes it includes");
      // console.log(loggedInUser.cart.quantity);
      

      res.redirect("/cart")
    }else{
      console.log("not includes");
      const addedToCart = await cartModel.create({
        foods: req.params.foodId,
      })

      loggedInUser.foodId.push(req.params.foodId)
    loggedInUser.cart.push(addedToCart._id)
    let seeUsersCart = await loggedInUser.save()
    console.log(seeUsersCart + ".....seeUsersCart");
    res.redirect("back")
    }

  } catch (err) {
    console.error(err)
  }
};


exports.incItem = async(req,res,next) =>{
  await cartModel.findByIdAndUpdate({_id:req.params.cartId} , {$inc:{quan:1}})
  res.redirect("back")
}

exports.decItem = async(req,res,next) =>{
  await cartModel.findByIdAndUpdate({_id:req.params.cartId} , {$inc:{quan:-1}})
  res.redirect("back")
}





//cloudinary code
