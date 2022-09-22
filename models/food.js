const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/wyny")

const foodSchema = mongoose.Schema({
    fimg: String,
    foodname: String,
    descriptionoffood: String,
    price: Number,
    gst: { type: Number, default: "24" },
    delivery:{type:Number , default:"25"}
})

module.exports = mongoose.model("food", foodSchema)