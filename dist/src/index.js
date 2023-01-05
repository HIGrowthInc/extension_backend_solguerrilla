"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const multer = require("multer");
const cors = require("cors");
const routes_1 = require("./routes");
const redis_1 = require("./utils/redis");
const errorHandler_1 = require("./handlers/errorHandler");
const session = require("express-session");
const connectRedis = require("connect-redis");
const redis_2 = require("redis");
const DB_1 = require("./DB");
const passport_1 = require("./utils/passport");
var cookieParser = require('cookie-parser');
const upload = multer();
// app.enable('trust proxy') // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
class Server {
    // DB_CONFIG: string;
    constructor(app) {
        // app.enable('trust proxy')
        this.config(app);
        this.connect();
        // this.initRedis();
        new routes_1.default(app);
    }
    connect() {
        DB_1.default.getInstance();
    }
    config(app) {
        const redisClient = (0, redis_2.createClient)({ legacyMode: true });
        redisClient.connect().catch(console.error);
        const RedisStore = connectRedis(session);
        app.use(session({
            store: new RedisStore({ client: redisClient }),
            secret: "session_cookie_secret",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: true,
                maxAge: 1000 * 60 * 24
            }
        }));
        app.use(passport_1.default.initialize());
        app.use(passport_1.default.session());
        app.use(cookieParser());
        app.use(morgan('dev'));
        app.use((0, express_1.json)());
        app.use((0, express_1.urlencoded)({ limit: '5mb', extended: true }));
        app.use(helmet());
        app.use(cors());
        app.use(errorHandler_1.unCoughtErrorHandler);
        app.use(/\/((?!create_).)*/, upload.any());
    }
    initRedis() {
        redis_1.default.getInstance();
    }
}
exports.default = Server;
process.on('beforeExit', function (err) {
    console.error(err);
});
//# sourceMappingURL=index.js.map