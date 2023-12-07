import User from "../models/user.model";
import extend from "lodash/extend";
import handleError from "../helpers/dbErrorHandling";

const create = async (req,res,next) => {
 const user = new User(req.body)
  try {
         await user.save()
         return res.status(200).json({
             message: "Successfully signed up!"
         });
      }
  catch (err) {
         return res.status(400).json({
             error: "Error in signing" + err
         });
  } 
 }

const list = async (req, res) => {
try {
    // select to show only name, email and explicitly NOT_id. Fields to show, see User scema
    let users = await User.find().select({name: 1,email: 1, _id:0});
    
    res.status(200).json(users);
} catch (err) {
    return res.status(400).json({
        error: "Error at getting" + err
    });
}
}
const userByID = async (req, res, next, id) => {
    try {
        let idUser = await User.findById(id)
        if(!idUser){
            return res.status(400).json({
                error: "user not found"
            });
            
        }
        // -> if the requested id is valid and has been found pass to .get(userController.read)
        req.profile = idUser;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve user: " +err
        })
        
    }
}

const read = (req, res) => {
    return res.json(req.profile)
}

const update = async (req, res, next) => {
try {
    // pass in the profile
    let user = req.profile;
    user = extend(user, req.body)
    user.updated = Date.now();
    await user.save();
    return res.status(200).json("User updated: "+ user)

} catch (err) {
    return res.status(400).json({
        error: "Error in user update."
    })
}
}
const remove = async (req, res) => {
    try {
        let user = req.profile;
        let userName = user.name;
        let deletedUser = await user.deleteOne();
        return res.status(200).json("User: "+userName+" deleted. Have a nice day.");
    } catch (err) {
        return res.status(400).json({
            error:"Erron in user deletion."
        })
    }
}

export default {create, list , userByID, read, update, remove};