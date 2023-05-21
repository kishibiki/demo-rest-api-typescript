import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import api from './routes/api';
import {connectDB} from './db/connect';
const app = express();
const PORT = 8080;
import * as dotenv from 'dotenv'

dotenv.config();

app.use(express.json());
// app.use(express.static("./public"));
 
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));
  
// Parses the text as json
app.use(bodyParser.json());
 
app.use("/api", api);

app.use((err:Error, req:express.Request, res:express.Response, next:NextFunction) => {
    res.status(500).json({message:err.message});
});

const start = async () =>{
    try{
        // MongoDBに接続
        await connectDB();
        app.listen(PORT, () => console.log("server listend"));
    }
    catch(err){
        console.log(err);
    }
};

start();
