//login endpt
import express, {Request,Response} from "express";

import bcrypt from 'bcryptjs';
import { check, validationResult } from "express-validator";
import User from '../models/user';
import jwt from 'jsonwebtoken';
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/login",[ 
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more character is requried").isLength({min:6,}),],
    async(req:Request, res:Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array() })
        }
        const {email, password} = req.body;
        try{
            const user = await User.findOne({email})//shorthand email=email, find if email exists in db
            if(!user){
                return res.status(400).json({ message: "Invalid Credentials"});
            }
            //brcypt encrypts the password provided and checks if it matches, it wont decrypt - not possible
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({ message: "Invalid Credentials"});
            }

            const token = jwt.sign({userID: user.id}, process.env.JWT_SECRET_KEY as string, {
                expiresIn: "1d",
            });
            res.cookie("auth_token", token, {
                httpOnly:true,
                secure: process.env.Node_ENV === "production",
                maxAge:86400000,
            });
            res.status(200).json({userId: user._id})
        } catch(e){
            console.log(e);
            res.status(500).json({message:"Something went wrong"})
        }
});
/* 
verifyToken - middleware: checks the token recieved by frontend.
If ok, passes onto the arrow function to run and send status 200-OK
*/
router.get("/validate-token", verifyToken, (req:Request, res: Response) => {
    res.status(200).send({userId: req.userId})
});

//return empty token that expires at creation - the token cannot be used again
router.post("/logout", (req:Request, res:Response) => {
    res.cookie("auth_token", "", {
        expires:new Date(0),
    });
    res.send();
});

export default router;