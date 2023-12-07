import mongoose from "mongoose";
import bcrypt from "bcrypt";

/*
Creating schema for mongoose middleware to connect node/mongodb
*/

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required: "Name is required"
    },
    email:{
        type:String,
        trim:true,
        unique: "Email already exists. Email must be unique.",
        match: [/.+\@.+\..+/, "Please fill avalid email address."]
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    password:{
        type:String,
        required: "Password is required"

    },

});

// This is mongoose pre save hook to modify model object 
// before it is saved to database we salt and hash user password
userSchema.pre("save", async function(next){
    console.log("user about to be created and saved: " + this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model("User", userSchema)