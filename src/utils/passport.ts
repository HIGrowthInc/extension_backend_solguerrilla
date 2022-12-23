import * as passport from 'passport';
import {Strategy as LocalStrategy} from "passport-local/lib"
import users from '../repositories/users';
import AccountTypeRepository from '../repositories/account_type';
import * as bcrypt from "bcryptjs"
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';    
import { JWT_CONFIG } from '../utils';
export const cookieExtractor = function(req) {  
  return req.headers["auth-token"]
};
const opts: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_CONFIG.secret,
};
    passport.use(
      "local",new LocalStrategy(
          { usernameField: "email", passwordField: "password",passReqToCallback:true },
          async (req,email, password, done) => {
              const _user = await users.readByEmail(email);
              
              if(!_user){
                return done(null,false,{message:"There is no Email. please login.\n"});
                 
              }
              if(!bcrypt.compareSync(password,_user.password)){
                 return done(null,false,{message:"Invalid Password!"});
                 
              }
             
                return done(null, _user);
              
          }
      )
    );
    passport.serializeUser((user:any, done) => {
        done(null, user.id);
      });
     
      passport.deserializeUser(async (id:number, done) => {
        const _user = await users.readById(id);
        
        if (!_user) {
          done(null, false);
          return;
        }
        const accountTypeRec = await AccountTypeRepository.readById(_user.account_type);
        if(!accountTypeRec){
           done(null,false);
           return;
        }
      
        done(null, {
          id:_user.id , 
          email:_user.email ,
          img:_user.image_url ,
          first_name:_user.first_name ,
          last_name:_user.last_name ,
          city:_user.city ,
          state:_user.state,
          country:_user.country,
          is_init:_user.is_init,
          is_admin:_user.is_admin,
          account_type:accountTypeRec.name
        });
      });

      passport.use("jwt",new JWTStrategy(opts,(jwt_payload: any, done: any)=>{
          users.readById(jwt_payload.jid).then(async (user)=>{
           
            if(user){
              const accountTypeRec = await AccountTypeRepository.readById(user.account_type);
              if(!accountTypeRec){
                done(null,false);
                return;
              }

              return done(null,{
                id:user.id , 
                email:user.email ,
                img:user.image_url ,
                first_name:user.first_name ,
                last_name:user.last_name ,
                city:user.city ,
                state:user.state,
                country:user.country,
                is_init:user.is_init,
                is_admin:user.is_admin,
                account_type:accountTypeRec.name
              })
            }
            return done(null,false)
          }).catch((err:any)=>{
            return done(err)
          })

      }))
      
      
    
export default passport;
