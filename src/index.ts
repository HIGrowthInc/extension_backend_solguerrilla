import { Application, urlencoded, json } from 'express';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as multer from "multer"
import * as cors from 'cors';
import Routes from './routes';
import CRedis from './utils/redis';
import { unCoughtErrorHandler } from './handlers/errorHandler';
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { createClient } from 'redis';
import DB from './DB';
import passport from './utils/passport';
var cookieParser = require('cookie-parser')

const upload =  multer();
// app.enable('trust proxy') // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
export default class Server {
    // DB_CONFIG: string;
    
    
    constructor(app: Application) {
        // app.enable('trust proxy')
        this.config(app);
        this.connect();
        // this.initRedis();
        new Routes(app);
    }

    public connect(){
        DB.getInstance()
    }

    public config(app: Application): void {
        const redisClient = createClient({legacyMode:true});
        redisClient.connect().catch(console.error);
        const RedisStore = connectRedis(session);
        
        app.use(session({
            store:new RedisStore({client:redisClient}),
            secret: "session_cookie_secret",
            resave:false,
            saveUninitialized:false,
            cookie:{
                secure:true,
                maxAge:1000*60*24
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(cookieParser())
        app.use(morgan('dev'));
        app.use(json());
        app.use(urlencoded({limit: '5mb', extended: true}));
        app.use(helmet());
        app.use(cors());
        app.use(unCoughtErrorHandler);
        app.use(/\/((?!create_).)*/,upload.any())
    
    }

    public initRedis(): void {
         CRedis.getInstance()
    }
}

process.on('beforeExit', function (err) {
    console.error(err);
});
