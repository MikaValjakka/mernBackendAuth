import config from "./../config/config";
import app from "./express";
import mongoose from "mongoose";


//mongoose.Promise = global.Promise <- was mongoose 4.* based. After mongoose 5.* no need


const connectDB = async ()=>{
    try {
        await mongoose.connect(
                config.mongoUri, {
                //useNewUrlParser: true,
                //seUnifiedTopology: true
    });
        } catch (err){
    console.log("Error while connecing to mongoDB by mongoose: " +err)
                     }
    }
connectDB();
mongoose.connection.once("open", ()=>{
    console.log(`Mongoose connected to mongoDB at : ${config.mongoUri}. Have nice day.`);
})


app.listen(config.port, (err)=> {
    if(err) {
        console.log("Error in connection:" + err);
    }
    console.info(`Server started on port ${config.port}`);

})