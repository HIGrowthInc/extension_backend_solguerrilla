"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_CONFIG = exports.COOKIE_CONFIG = exports.REFRESH_CONFIG = exports.JWT_CONFIG = exports.generateHash = exports.generateRandom = void 0;
;
const crypto_1 = require("crypto");
const generateRandom = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generateRandom = generateRandom;
const generateHash = () => {
    const md5sum = (0, crypto_1.createHash)('md5');
    return md5sum.digest('hex');
};
exports.generateHash = generateHash;
exports.JWT_CONFIG = {
    secret: process.env.JWT_SECRET || '6d4fd1034a81f2f98db778237bc71a60',
    algorithms: ['HS256'],
};
exports.REFRESH_CONFIG = {
    secret: process.env.REFRESH_TOKEN_SECRET || "fgkjddshfdjh773bdjsj84-jdjd774",
    expiry: process.env.REFRESH_TOKEN_EXPIRY || "60*60*24*30",
};
exports.COOKIE_CONFIG = {
    secret: process.env.COOKIE_SECRET || "jhdshhds884hfhhs-ew6dhjd"
};
exports.SESSION_CONFIG = {
    expiry: process.env.SESSION_EXPIRY || "60*15*1000"
};
//# sourceMappingURL=index.js.map