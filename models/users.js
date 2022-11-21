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
   foodId:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:"food"
      }
   ],
   cart:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"cart"
      }
   ],
   order:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"order"
      }
   ],
   role:{
      type:String,
      enum:['user' , 'admin'],
      default:"user"
   },
   likes:{type:Array}
   //this is for role of admin
   //only admin role will access the admin panel and admin will
   //have power to make another user admin.
})


userSchema.plugin(plm , {usernameField:'email'})
userSchema.plugin(findOrCreate)

module.exports = mongoose.model("user" , userSchema)
