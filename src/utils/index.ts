;
import {createHash} from "crypto"
export const generateRandom=():number=>{
    return Math.floor(100000 + Math.random() * 900000)
};
export const generateHash = ():string=>{
    const md5sum = createHash('md5');
    return md5sum.digest('hex')
}
export const JWT_CONFIG ={
    secret:process.env.JWT_SECRET || '6d4fd1034a81f2f98db778237bc71a60',
    algorithms: ['HS256' as const],
}
export const REFRESH_CONFIG ={
    secret:process.env.REFRESH_TOKEN_SECRET || "fgkjddshfdjh773bdjsj84-jdjd774",
    expiry:process.env.REFRESH_TOKEN_EXPIRY || "60*60*24*30",
}
export const COOKIE_CONFIG={
    secret:process.env.COOKIE_SECRET || "jhdshhds884hfhhs-ew6dhjd"
}
export const SESSION_CONFIG ={
    expiry:process.env.SESSION_EXPIRY|| "60*15*1000"
}
