require('dotenv');
const mongoose=require('mongoose');
const connectionString=process.env.DATABASE_CONNECTION

const connectDB= async()=>{
    try {
        await mongoose.connect(connectionString,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        })
        console.log('connection to database succefull');
        
        
    } catch (error) {
       console.error('error')
       console.log(error)
       process.exit(1); // with status coode one
    }
}

module.exports=connectDB