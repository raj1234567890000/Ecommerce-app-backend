import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'


import cors from 'cors'



// Load environment variables from .env file
dotenv.config({ path: "./.env" }); 

//database config
connectDB();
//rest objecct
const app = express();
//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);
//app.use(express.static(path.join(__dirname,'./client/build')))

//rest api
app.get("/", (req, resp) => {
  resp.send("<h1>Hello World!</h1>");
});

//app.use('*',function(req,res){
  //res.sendFile(path.join(__dirname,'/client/build/index.html'));
//})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running ${process.env.DEV_MODE} on port ${PORT}`);
});
