import * as Faunadb from "faunadb"
require('dotenv').config()

export enum DB_INDEX {
    USER_BY_UID = "user_by_uid",
  }
  
  export enum DB_COLLECTION {
    USERS = "Users",
  }

// const {
//     Paginate,
//     Get,
//     Select,
//     Match,
//     Index,
//     Create,
//     Collection,
//     Lambda,
//     Var,
//     Join,
//     Ref
// }  = Faunadb.query


export default class FaunaDBHelper {

    private client!: Faunadb.Client
    private FQL = Faunadb.query

    conect(){
       return new Faunadb.Client({secret:process.env.FAUNA_SECRET!});
    }

    Create(Collection:string, data:Record<string,any>,ref:string,client?:Faunadb.Client){
          try {
            client = client ?? this.conect();
            const FQL  =  this.FQL
              return client.query(
                  FQL.Create(FQL.Ref(FQL.Collection(Collection),ref),{
                    data:data
                  })
              )
          }catch (err){
             throw Error(err); 
          }
    }

    Update(Collection:DB_COLLECTION,ref:string,newData:Record<string,any>,client?:Faunadb.Client){
        try {
            client = client ?? this.conect()
            const FQL = this.FQL
            return client.query(FQL.Update(FQL.Ref(FQL.Collection(Collection),ref),{data:newData}));
            
        }catch(err){
            throw Error(err)
        }
    }

    Get(Collection :string ){
        try {
            const FQL  =  this.FQL
            return this.client

        }catch (err){
            throw Error(err)
        }
    }
    async GetBy(QueryIndex:string,key:string | number | boolean,client?:Faunadb.Client){
        
        try {
            client = client ?? this.conect();
        const FQL  =  this.FQL
        const queryResult = await client.query(FQL.Get(FQL.Match(FQL.Index(QueryIndex),key)))
        return queryResult;
        }catch (err){
            throw Error(err)
        }
    }



}
