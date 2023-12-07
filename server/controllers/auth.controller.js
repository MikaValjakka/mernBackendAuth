import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { expressjwt as ejwt}from "express-jwt";
import config from "./../../config/config";
import bcrypt from "bcrypt";
import webpackNodeExternals from "webpack-node-externals";

const signin = async(req, res) =>{
    try {
        // Pass post user email to const
        let userSigninIn = await User.findOne({email: req.body.email});

        // if no such user exist (userSigninIn false/true)
        if(!userSigninIn){
            return res.status(401).json({
                error: "user not found"
            })
        } else {
            // comparings given password(as hashed) to db user hashed pw
            console.log("Found user in DB:"+ userSigninIn)
             const auth = await bcrypt.compare(req.body.password, userSigninIn.password)
             if(auth){
                console.log("User is in our DB");
                // Creating jwt: when user is signed in gives cookie
                const token = jwt.sign({_id: userSigninIn._id}, config.jwtSecret)

                res.cookie("t", token, {expire: new Date() + 9999});


                return res.status(200).json({
                    token,
                    user: {
                        _id: userSigninIn._id,
                        name: userSigninIn.name,
                        email: userSigninIn.email
                    }
                })
             } else{
                return res.status(401).json({
                    error:"Wrong password",
                    
                })
                
                
             }
        }
        
    } catch (err) {
        return res.status(401).json({
            error:"Error in signin in. Could not sign in."
        })
    }
};
// /auth/signout
const signout = (req, res, next) =>{
    res.clearCookie("t");
    return res.status(200).json({
        message: "Signed out. Have a nice day."
    })
};

const requireSignin = ejwt({
    secret: config.jwtSecret,
    userProperty: "auth",
    algorithms: ["HS256"] 
})

// authorization checking based on user profile to be handeled and cookie _id of handler
const hasAuthorization = (req, res, next) =>{
const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!authorized){
        return res.status(401).json({
            error:"User is not authorized"
        })
    }
    next();
};

export default {signin, signout, requireSignin, hasAuthorization};