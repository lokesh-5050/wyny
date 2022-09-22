const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/wyny")
const plm = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')

const userSchema = mongoose.Schema({
   username:{type:String , requried:true},
   email:{type:String , requried:true},
   phoneNo:{type:String , requried:true},
   state:{type:String , requried:true},
   city:{type:String , requried:true},
   pincode:{type:String , requried:true},
   cart:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"cart"
      }
   ]
})


userSchema.plugin(plm , {usernameField:'email'})
userSchema.plugin(findOrCreate)

module.exports = mongoose.model("user" , userSchema)
