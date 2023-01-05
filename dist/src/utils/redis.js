"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const config_1 = require("../config");
class CRedisInstance {
    constructor() {
        this.redisClient = undefined;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.redisClient = (0, redis_1.createClient)({
                    url: config_1.REDIS_CONFIG.HOST
                });
                yield this.redisClient.connect();
            }
            catch (err) {
                console.error('redis init err: ', err);
            }
        });
    }
    onError() {
        this.redisClient.on('error', (err) => {
            console.log('redisClient error :' + err);
        });
    }
    onConnect() {
        this.redisClient.on('connect', () => {
            console.log('redisClient connect');
        });
    }
    getRedisClient() {
        return this.redisClient;
    }
    getObject(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redisClient.get(key);
                if (res == undefined) {
                    return {};
                }
                else {
                    return JSON.parse(res);
                }
            }
            catch (e) {
                console.error('redis server error: ', e);
                return {};
            }
        });
    }
    setObject(key, defaultValue, timeout = 1000 * 60 * 60) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redisClient.get(key);
                const value = JSON.stringify(defaultValue);
                yield this.redisClient.set(key, value);
                this.redisClient.expire(key, timeout);
                return defaultValue;
            }
            catch (e) {
                console.error('redis server error: ', e);
                return defaultValue;
            }
        });
    }
    initVaule(key, defaultValue, timeout = 1000 * 60 * 60) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redisClient.get(key);
                if (res == undefined) {
                    yield this.redisClient.set(key, defaultValue);
                    this.redisClient.expire(key, timeout);
                }
                else {
                    defaultValue = parseInt(res);
                }
                return defaultValue;
            }
            catch (e) {
                console.error('redis server error: ', e);
                return defaultValue;
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redisClient.get(key);
                if (res == undefined) {
                    return 0;
                }
                else {
                    return parseInt(res);
                }
            }
            catch (e) {
                console.error('redis server error: ', e);
                return 0;
            }
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redisClient.set(key, value);
            }
            catch (e) {
                console.error('redis server error: ', e);
            }
        });
    }
}
class CRedis {
    constructor() {
    }
    static getInstance() {
        if (!CRedis._credisClient) {
            CRedis._credisClient = new CRedisInstance();
            CRedis._credisClient.init();
            CRedis._credisClient.onConnect();
            CRedis._credisClient.onError();
        }
        return CRedis._credisClient;
    }
}
exports.default = CRedis;
//# sourceMappingURL=redis.js.map