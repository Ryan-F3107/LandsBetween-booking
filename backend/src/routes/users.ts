//Register EndPt
import express, {Request, Response} from "express";
import User from '../models/user';
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator';

const router = express.Router();

/* api/users/register
whenever post request is sent to register,
express-validator will check if properties exists - assemble the errors in an array.
it forwards that request to the async function which checks if the validation error array is empty
*/
router.post("/register", [
    check("firstName", "First Name is required").isString(),   //check if the property exists in body
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({ 
        min:6
    })
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){  //if not empty
            return res.status(400).json({ message: errors.array() });
        }
    try{
        let user = await User.findOne({ //find any documents where email matches the email in body
            email: req.body.email,
        });

        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        user = new User(req.body)   //creates new user
        await user.save();  //saves user information
        //create a token
        const token = jwt.sign(
            {userID: user.id}, 
            process.env.JWT_SECRET_KEY as string,
            {expiresIn:"1d"},
        );
        //1st arg - name of cookie
        //Don't send anything in body since we are sending an http cookie, handled by broswer automatically
        res.cookie("auth_token", token, {
            httpOnly: true, //accepted from http only, only from the server
            secure: process.env.NODE_ENV === "production",  //secure - only accept cookies from https - when project in production
            maxAge: 86400000,   //needs to be same as token expiry duration in miliseconds
        })
        return res.status(200).send({message: "User registered Ok"});
    } catch(e){
        console.log("register Error: ", e);
        res.status(500).send({message: "Something went wrong"}) //generic error since error could be sensitive
    }
})

export default router;