import { createClient } from 'redis';
import { REDIS_CONFIG } from '../config';
export type IObject ={
    [key:string]:any
}
class CRedisInstance {
    redisClient: any;

    constructor() {
        this.redisClient = undefined;
    }

    async init() {
        try {
            this.redisClient = createClient({
                url: REDIS_CONFIG.HOST
            });

            await this.redisClient.connect();
        } catch (err) {
            console.error('redis init err: ', err);
        }
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
    async getObject(key: string): Promise<IObject> {
        try {
            const res = await this.redisClient.get(key);

            if (res == undefined) {
                return {};
            } else {
                return JSON.parse(res);
            }
        } catch (e) {
            console.error('redis server error: ', e);
            return {};
        }
    }
    async setObject(key:string,defaultValue:IObject,timeout=1000*60*60){
        try {
            const res = await this.redisClient.get(key);
            
                const value = JSON.stringify(defaultValue);
                await this.redisClient.set(key, value);
                this.redisClient.expire(key, timeout);
            
            return defaultValue;
        } catch (e) {
            console.error('redis server error: ', e);
            return defaultValue;
        }
    }
    async initVaule(key: string, defaultValue: number,timeout =1000*60*60): Promise<number> {
        try {
            const res = await this.redisClient.get(key);

            if (res == undefined) {
                await this.redisClient.set(key, defaultValue);
                this.redisClient.expire(key, timeout);
            } else {
                defaultValue = parseInt(res);
            }

            return defaultValue;
        } catch (e) {
            console.error('redis server error: ', e);
            return defaultValue;
        }
    }

    async get(key: string): Promise<number> {
        try {
            const res = await this.redisClient.get(key);

            if (res == undefined) {
                return 0;
            } else {
                return parseInt(res);
            }
        } catch (e) {
            console.error('redis server error: ', e);
            return 0;
        }
    }

    async set(key: string, value: number) {
        try {
            await this.redisClient.set(key, value);
        } catch (e) {
            console.error('redis server error: ', e);
        }
    }
}
class CRedis {
    private static _credisClient:CRedisInstance;
    constructor(){
    }
    static   getInstance(){
        if (!CRedis._credisClient) {
            CRedis._credisClient = new CRedisInstance();
            CRedis._credisClient.init();
            CRedis._credisClient.onConnect();
            CRedis._credisClient.onError();

        }
        return CRedis._credisClient;
    }

}

export default CRedis;
