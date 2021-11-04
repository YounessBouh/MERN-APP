const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'please provide product name'],
        unique:true,
    },
    rating:{
        type:Number,
        required:[true,'please provide product rating']
    },

    description:{
        type:String,
        required:[true,'please provide product description']
    },
    imageURL:{
        type:String,
        required:[true,'plz provide the image URL']
    },

    price:{
        type:Number,
        required:[true,'please provide product price'],
    },
})

const product= mongoose.model('product',productSchema)

module.exports=product;