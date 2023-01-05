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
exports.cookieExtractor = void 0;
const passport = require("passport");
const lib_1 = require("passport-local/lib");
const users_1 = require("../repositories/users");
const account_type_1 = require("../repositories/account_type");
const bcrypt = require("bcryptjs");
const passport_jwt_1 = require("passport-jwt");
const utils_1 = require("../utils");
const cookieExtractor = function (req) {
    return req.headers["auth-token"];
};
exports.cookieExtractor = cookieExtractor;
const opts = {
    jwtFromRequest: exports.cookieExtractor,
    secretOrKey: utils_1.JWT_CONFIG.secret,
};
passport.use("local", new lib_1.Strategy({ usernameField: "email", passwordField: "password", passReqToCallback: true }, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const _user = yield users_1.default.readByEmail(email);
    if (!_user) {
        return done(null, false, { message: "There is no Email. please login.\n" });
    }
    if (!bcrypt.compareSync(password, _user.password)) {
        return done(null, false, { message: "Invalid Password!" });
    }
    return done(null, _user);
})));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const _user = yield users_1.default.readById(id);
    if (!_user) {
        done(null, false);
        return;
    }
    const accountTypeRec = yield account_type_1.default.readById(_user.account_type);
    if (!accountTypeRec) {
        done(null, false);
        return;
    }
    done(null, {
        id: _user.id,
        email: _user.email,
        img: _user.image_url,
        first_name: _user.first_name,
        last_name: _user.last_name,
        city: _user.city,
        state: _user.state,
        country: _user.country,
        is_init: _user.is_init,
        is_admin: _user.is_admin,
        account_type: accountTypeRec.name
    });
}));
passport.use("jwt", new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
    users_1.default.readById(jwt_payload.jid).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            const accountTypeRec = yield account_type_1.default.readById(user.account_type);
            if (!accountTypeRec) {
                done(null, false);
                return;
            }
            return done(null, {
                id: user.id,
                email: user.email,
                img: user.image_url,
                first_name: user.first_name,
                last_name: user.last_name,
                city: user.city,
                state: user.state,
                country: user.country,
                is_init: user.is_init,
                is_admin: user.is_admin,
                account_type: accountTypeRec.name
            });
        }
        return done(null, false);
    })).catch((err) => {
        return done(err);
    });
}));
exports.default = passport;
//# sourceMappingURL=passport.js.map