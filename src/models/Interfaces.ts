


export interface UserModel {
    uid:string;
    firstName:string;
    lastName:string;
    geolocation?:GeoLocation
    
}

export interface GeoLocation {
    lat?:number;
    lng?:number;
    altitude?:number;
    altitudeAccuracy?:number;
    accuracy?:number;
    heading?: number;
    speed?:number;
}

