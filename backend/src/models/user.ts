import mongoose from "mongoose";
import bcrypt from "bcryptjs";
/* describe the user & its attributes
TypeScript notifies us if we are missing properties
*/
export type UserType = {
    _id:string;
    email:string;
    password: string;
    firstName: string;
    lastName: string;
};

//user schema, what properties get stored with users
//pass object to schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
});

/* 
Middleware for mongoDB, check if password has changed
bcrypt called to hash the password. 
Have the middleware here to keep the logic in user route light
*/
userSchema.pre("save", async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next(); //goes to the next function or call
});

//create the model-mention in which document it would be stored
const User = mongoose.model<UserType>("User", userSchema)

export default User;