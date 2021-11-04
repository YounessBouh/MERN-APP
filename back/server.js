require('dotenv').config(); // look at any .env file in root directory
const express=require('express');
const app=express();
const connectDB=require('./config/db')
const errorHandler=require('./middleware/errorHandler')
 connectDB();

 //midleware
 app.use(express.json());
 app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
  }) 

 //Routes
 app.use('/api/v1/products',require('./routes/productRoutes'))

 //Error Handler
app.use(errorHandler)

PORT=process.env.PORT ;

app.listen(PORT,console.log(`server is running on Port ${PORT}` ))
