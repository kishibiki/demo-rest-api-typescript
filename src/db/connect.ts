//import * as mongoose from "mongoose";
import mongoose, { ConnectOptions } from "mongoose";

// 末尾に!を付けてstringであることを保証
export const connectDB = () =>{
    const URI = process.env.MONGO_URI!;
    console.log(URI)
    mongoose.set("strictQuery", false);
    return mongoose
        .connect(URI!)
        .then(() => console.log("connect to mongoDB"))
        .catch((err:Error) => console.log(err));
};
