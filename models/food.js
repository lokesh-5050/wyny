const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/wyny")

const foodSchema = mongoose.Schema({
    fimg:String,
    foodname:String,
    descriptionoffood:String,
    price:String
})

module.exports = mongoose.model("food" , foodSchema)