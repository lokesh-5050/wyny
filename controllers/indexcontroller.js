const foodModel = require("../models/food")
const userModel = require("../models/users")

exports.loginpage = (req,res,next)=>{
    res.render("loginpage")

}

exports.createUser = (req,res,next)=>{
    const newUser = 

}


exports.homepage = (req,res,next)=>{
    res.render("index")

}

exports.adminHomepage = (req,res,next)=>{
    
    res.render("adminHome")

}

exports.menu = async(req,res,next)=>{
    const foodItems = await foodModel.find()
    console.log(foodItems +  "  showed foodItems");
    res.render("menu" , {foodItems})

}


exports.foodItems = async(req,res,next)=>{
    try{
        const foodItems = await foodModel.create({
            fimg:req.file.path,
            foodname:req.body.foodname,
            descriptionoffood:req.body.descriptionoffood,
            price:req.body.price
        })
        console.log(foodItems + " added  foodItems");
    
        res.redirect(req.headers.referer)
    }catch(err){
        res.send(404).json("err" + err)

    }

}


exports.cart = async(req,res,next)=>{
    try{
       res.render("cart")
    }catch(err){
        res.send(404).json("err" + err)

    }

}



//cloudinary code