const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    firstname:{type:String , require:true},
    lastname:{type:String , require:true},
    address1:{type:String , require:true},
    address2:{type:String , require:true},
    email:{type:String , require:true},
    phoneNo:{type:Number , require:true},
    paymentMode:{type:String},
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    status:{type:String},
})

module.exports = mongoose.model("order", orderSchema)