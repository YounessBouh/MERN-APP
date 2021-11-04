const Product=require('../models/Product');
const asyncHandler=require('../middleware/asyncHandler')
const ErrorResponse=require('../utils/errorResponse')


exports.getAllProducts= asyncHandler( async (req,res,next)=>{
 let query;
 let uiValues={
     filtering:{},
     sorting:{}
 }
 const reqQuery={...req.query};
 const removeField=['sort'];
 removeField.forEach((val)=>delete reqQuery[val])

 const filterKeys=Object.keys(reqQuery);
 const filterValues=Object.values(reqQuery);
 filterKeys.forEach((val,idx)=>uiValues.filtering[val]=filterValues[idx]);

 let queryStr=JSON.stringify(reqQuery);
 queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,(match)=>`$${match}`)
// convert format from {price:{lte:'900'},sort:'-price'} to {'price': {'$lte':'900'}} 

query=Product.find(JSON.parse(queryStr));

if(req.query.sort){
 const sortByArr=req.query.sort.split(',');
 sortByArr.forEach(val=>{
     let order;
     if(val[0]==='-'){
         order='descending'
     }else
     {
        order='ascending'
     }
     uiValues.sorting[val.replace('-','')]=order;

 })
 const sortByStr=sortByArr.join(' ');
 query=query.sort(sortByStr);
} else{
    query=query.sort('-price')
}



   // const products= await Product.find(JSON.parse(queryStr));
   const products= await query;
   const maxPrice= await Product.find().sort({price:-1}).limit(1).select('-_id price'); //get the first one descending
   const minPrice= await Product.find().sort({price:1}).limit(1).select('-_id price');
   uiValues.maxPrice=maxPrice[0].price;
   uiValues.minPrice=minPrice[0].price;
    res.status(200).json({
        success:true,
        data: products,
        uiValues,
    })
});

exports.createNewProduct= asyncHandler( async(req,res,next)=>{
    const product= await Product.create(req.body);
    res.status(201).json({
        success:true,
        data: product
    })
});

exports.updateProductById= asyncHandler( async(req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorResponse(`the product with ${req.params.id} was not Found`,404))
    }
   product= await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
   res.status(201).json({
    success:true,
    data: product
})
});

exports.deleteProductById= asyncHandler( async(req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorResponse(`the product with ${req.params.id} was not Found`,404))
    }
   await product.remove();
   res.status(200).json({
    success:true,
    data: {}
})
});