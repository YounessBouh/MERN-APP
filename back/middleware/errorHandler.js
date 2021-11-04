const ErrorResponse=require('../utils/errorResponse')

const errorHandler=(err,req,res,next)=>{
    console.log(err)
    let error={...err}
    error.message=err.message;
    if(err.name==='CastError'){
        const message='Resource not Found'
        error=new ErrorResponse(message,404)
    }

    if(err.code===11000){
        const message='the value is duplicated'
        error=new ErrorResponse(message,400)
    }

    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(error=>error.message).join(',');
        error=new ErrorResponse(message,400)
    }

    // add more checks for differents errors
    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || 'server Error'
    })
}

module.exports=errorHandler