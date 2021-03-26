import express from "express";
import { UserModel, GeoLocation } from "./models/Interfaces";
import Utils from "./Utils/Utils";
import FaunaDBHelper, { DB_COLLECTION, DB_INDEX } from "./Utils/FaunaDbHelper";

require('dotenv').config()
const app = require("express")();
const PORT = process.env.PORT ?? 5000
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))


app.get("/user/get/:id", async (req: any, res: any) => {
  try {
    const doc = await new FaunaDBHelper().GetBy(
      DB_INDEX.USER_BY_UID,
      req.params.id
    );
    const user: UserModel = (doc as { data: UserModel }).data;
    res.send(user);
  } catch (error: any) {
    res.send(error);
  }
});

app.post("/user/profile/update",async (req:any, res:any)=>{
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


app.post("/user/create", async (req: any, res: any) => {
  try {
    const newUserData = req.body as UserModel;
    if (!newUserData.firstName || newUserData.firstName.length < 2) {
      res.send("First Name Required");
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


app.post("/",(req:any, res:any)=>{
    res.send("Hi")
});
app.get("/",(req:any, res:any)=>{
    res.send("Hi")
});


app.listen(PORT, () => console.log(`API  http://localhost:${PORT} & ${process.env.FAUNA_SECRET}`));
