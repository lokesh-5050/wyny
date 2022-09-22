const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    foods:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"food",
        }
    ],
    
    quantity:{
        type:Number,
        default:"1"
    }        
    

})

module.exports = mongoose.model("cart" , cartSchema)