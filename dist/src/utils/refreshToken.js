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
exports.VerifyUser = exports.checkRefreshToken = exports.addRefreshToken = exports.getRefreshToken = exports.getToken = exports.COOKIE_OPTIONS = void 0;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const _1 = require(".");
const redis_1 = require("./redis");
exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    maxAge: eval(_1.REFRESH_CONFIG.expiry) * 1000,
    // sameSite:"none"
};
const getToken = (user) => {
    return jwt.sign(user, _1.JWT_CONFIG.secret, {
        expiresIn: eval(_1.SESSION_CONFIG.expiry)
    });
};
exports.getToken = getToken;
const getRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, _1.REFRESH_CONFIG.secret, {
        expiresIn: eval(_1.REFRESH_CONFIG.expiry)
    });
    return refreshToken;
};
exports.getRefreshToken = getRefreshToken;
const addRefreshToken = (key, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_1.default.getInstance().setObject(key.toString(), {
            refresh_token: token,
            expires: _1.REFRESH_CONFIG.expiry
        });
    }
    catch (error) {
        console.log("add Refresh token error");
    }
});
exports.addRefreshToken = addRefreshToken;
const checkRefreshToken = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = yield redis_1.default.getInstance().getObject(key.toString());
        return status;
    }
    catch (err) {
        console.error("Fetching token from cache failed");
    }
});
exports.checkRefreshToken = checkRefreshToken;
exports.VerifyUser = passport.authenticate("jwt", { session: false });
//# sourceMappingURL=refreshToken.js.map