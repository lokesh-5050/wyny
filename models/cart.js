const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    foods:[
        {
            types:mongoose.Schema.Types.ObjectId,
            ref:"food"
        }
    ],
    user:{
        types:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})

module.exports = mongoose.model("cart" , cartSchema)