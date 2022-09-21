const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/wyny")
const plm = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')

const userSchema = mongoose.Schema({
   name:{type:String , requried:true},
   email:{type:String , requried:true},
   phoneNo:{type:String , requried:true},
   state:{type:String , requried:true},
   city:{type:String , requried:true},
   pincode:{type:String , requried:true},
})


userSchema.plugin(plm , {usernameField:'email'})
userSchema.plugin(findOrCreate)

module.exports = mongoose.model("user" , userSchema)
