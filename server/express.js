import express from "express";
//import bodyParser, { urlencoded } from "body-parser"; <- deprecated. After express 4.* middleware is implemented in express.
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "./../template"; // <- html style template to be used as test
import userRoutes from "./routes/user.routes"
import authRoutes from "./routes/auth.routes"

const app = express()
app.use(helmet());

// app.use(bodyParser.json()); deprecated on express 4.* use express.json
app.use(express.json());
// app.use(bodyParser,urlencoded({extended:true})); deprecaded on express 4.* use express.urlencoded...
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(compress());
app.use(cors());


/*at route "/" send template.js
app.get("/", (req, res)=>{
    res.status(200).send(Template())
});
*/

app.use("/", userRoutes, authRoutes)

//Catching express-jwt errors
app.use((err, req,res,next)=>{
    if(err.name=== "unauthorizedError") {
        res.status(401).json({
            "error": err.name + ": " + err.message
        })
    } else if (err){
        res.status(400).json({
            "error" : err.name + ": " + err.message
        })
        console.log(err)
    }
})

export default app;