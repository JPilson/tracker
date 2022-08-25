import express from "express";
import { Application } from "express";
import { Request,Response } from "express";
import { UserModel, GeoLocation } from "./models/Interfaces";
import Utils from "./Utils/Utils";
import FaunaDBHelper, { DB_COLLECTION, DB_INDEX } from "./Utils/FaunaDbHelper";


interface RequestResponse<T> {
  length: number;
  data:Array<T>;
  error?: boolean;
  message?: Array<any>
}

require('dotenv').config()
const app:Application = express();
const PORT = process.env.PORT ?? 5000
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

function prepareResponse<T>(request:Request,response:Response,resData:Array<T>,error:any = null ){
  
  const respData:RequestResponse<T> = {
    length:resData.length,
    data:resData,
  }
  if(error){
    respData.error = true
    respData.message = [...error]
  }
  
  response.send(respData)
  return
}

app.get("/user/get/:id", async (req: Request, res: Response) => {

  try {
     res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const doc = await new FaunaDBHelper().GetBy(
      DB_INDEX.USER_BY_UID,
      req.params.id
    );
    const queryResult = (doc as {data:Array<any>})['data']   ;
    
    prepareResponse(req,res, [queryResult])
    return
  } catch (error: any) {
    prepareResponse(req,res, [],error);
    return
  }
});

app.post("/user/profile/update",async (req: Request, res: Response)=>{
    try{
     const newUserData = req.body as UserModel;
     if(!newUserData || !newUserData.uid){
         res.send("Invalid token")
         return;
     }
     const operation = await new FaunaDBHelper().Update(DB_COLLECTION.USERS,newUserData.uid,newUserData);
     res.send(operation)
    }catch (e){
        res.send(e)
    }
 });


app.post("/user/create", async (req: Request, res: Response) => {
  try {
    const newUserData = req.body as unknown as UserModel;
    if (!newUserData.firstName || newUserData.firstName.length < 2) {
      res.send()
      return;
    }

    if (!newUserData.lastName || newUserData.lastName.length < 2) {
      res.send("First Name Required");
      return;
    }

    newUserData.uid = Utils.generateUId();
    newUserData.geolocation = {
      lat: 0,
      lng: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      accuracy: 0,
      heading: 0,
      speed: 0,
    };
    const operation = await new FaunaDBHelper().Create(DB_COLLECTION.USERS, newUserData,newUserData.uid);
    res.send(operation);
  } catch (err) {
    const errResponse = {
      error: true,
      stack: err,
    };
    res.send(errResponse);
  }
});


app.post("/",(request: Request, response: Response)=>{
   response
   .type("text/plain")
   .send("Hi")
});
app.get("/",(req:any, res:any)=>{
    res.send("Hi")
});


app.listen(PORT, () => console.log(`API  http://localhost:${PORT} & ${process.env.FAUNA_SECRET}`));
