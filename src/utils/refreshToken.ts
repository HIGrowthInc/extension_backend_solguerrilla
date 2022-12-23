import * as passport from "passport";
import * as jwt from "jsonwebtoken";
import { JWT_CONFIG, REFRESH_CONFIG, SESSION_CONFIG } from ".";
import CRedis from "./redis";
export const COOKIE_OPTIONS ={  
    httpOnly:true,
    secure:true,
    maxAge:eval(REFRESH_CONFIG.expiry)*1000,
    // sameSite:"none"
}
export const getToken = (user)=>{
    return jwt.sign(user,JWT_CONFIG.secret,{
        expiresIn:eval(SESSION_CONFIG.expiry)
    });
}
export const getRefreshToken = (user)=>{
    const refreshToken = jwt.sign(user,REFRESH_CONFIG.secret,{
        expiresIn:eval(REFRESH_CONFIG.expiry)
    })
    return refreshToken;
}

export const addRefreshToken =async (key:number,token:string)=>{
   try{
    await CRedis.getInstance().setObject(key.toString(),{
        refresh_token:token,
        expires:REFRESH_CONFIG.expiry
     })
   }catch(error){
    console.log("add Refresh token error");
   }
}

export const checkRefreshToken =async (key:number)=>{
    try{
        const status = await CRedis.getInstance().getObject(key.toString());
        return status;
    }catch(err){
        console.error("Fetching token from cache failed")
    }
}
export const VerifyUser = passport.authenticate("jwt",{session:false});
