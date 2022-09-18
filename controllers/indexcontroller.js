const cloudinary = require("cloudinary").v2
const sharp = require("sharp");
const starterModel = require("../models/starter")



exports.homepage = (req,res,next)=>{
    res.render("index")

}

exports.adminHomepage = (req,res,next)=>{
    
    res.render("adminHome")

}

exports.menu = async(req,res,next)=>{
    const starterItems = await starterModel.find()
    console.log(starterItems +  "  showed starterItems");
    res.render("menu" , {starterItems})

}


// exports.starterItems = async(req,res,next)=>{
//     try{
//         const starterItems = await starterModel.create({
//             fimg:req.file.filename,
//             foodname:req.body.foodname,
//             descriptionoffood:req.body.descriptionoffood,
//             price:req.body.price
//         })
//         console.log(starterItems + " added  starterItems");
    
//         res.redirect(req.headers.referer)
//     }catch(err){
//         res.send(404).json("err" + err)

//     }

// }

exports.starterItems = async(req,res,next)=>{
    try{
        console.log(req.file.buffer);
        const data = await sharp(req.file.buffer).webp({ quality: 20 }).toBuffer();
        const stream = cloudinary.uploader.upload_stream(
          { folder: "DEV" },
          (error, result) => {
            if (error) return console.error(error);
            console.log(result);
          }
        );
        bufferToStream(data).pipe(stream);
        res.json("done")
        
    }catch(err){
        if(err) throw err
    }

}


//cloudinary code