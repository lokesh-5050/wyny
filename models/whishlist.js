const mongoose = require("mongoose")

const whistListSchema = mongoose.Schema({
    foods:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"starter"
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

module.exports = mongoose.model("starter" , whistListSchema)

//soon will bulilt whishlist