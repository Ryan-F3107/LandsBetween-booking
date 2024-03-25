import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';    //lets us talk to mongoose
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from "cookie-parser";
import path from 'path';
//need to mention string so it can't be undefined data type 
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))    //Helps us parse url
/* 
Server will only except request from origin url and it must include the credentials and http cookie. 
if any unknown url tries to access backend and it has the cookie, It still wont be able to access backend since url is different from origin url
*/
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}));
//Go to frontend path dist and server the static assests on the route of url that the backend runs on. - the backend servers up assets for frontend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);

app.listen(3000, () => {
    console.log("server running:3000")
})