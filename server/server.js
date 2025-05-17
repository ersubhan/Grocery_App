import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/Cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

// port number
const port = process.env.PORT || 5000;

// database connection 
await connectDB()
await connectCloudinary() // cloudinary connect

// allow multiple origins (multiple url's) 
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']

// middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// app route 
app.get("/", (req,res)=> res.send("API Is Working"));

// other routes 
app.use('/api/user', userRouter); //user routes
app.use('/api/seller', sellerRouter); //seller routes
app.use('/api/product', productRouter); //product routes
app.use('/api/cart', cartRouter); //product cart routes
app.use('/api/address', addressRouter); //address routes
app.use('/api/order', orderRouter); //order routes

// listing prot 
app.listen(port, ()=> {
    console.log(`Server Is Running On http://localhost:${port}`);
})