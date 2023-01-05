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
const bcrypt = require("bcryptjs");
const users_1 = require("../repositories/users");
const utils_1 = require("../utils");
const nodemailer_1 = require("../utils/nodemailer");
const redis_1 = require("../utils/redis");
const account_type_1 = require("../repositories/account_type");
const refreshToken_1 = require("../utils/refreshToken");
const passport_1 = require("../utils/passport");
const background_1 = require("../repositories/background");
const path = require("path");
const fs = require('fs');
class AuthController {
    constructor() {
        this.redisHandle = redis_1.default.getInstance();
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, first_name, last_name, city, state, country, isUpdate } = req.body;
            if (!email) {
                res.status(200).json({
                    status: false,
                    message: "Email is Invalid"
                });
                return;
            }
            try {
                // const url = req.protocol +"://"+req.get('host');
                const user = yield users_1.default.readByEmail(email);
                if (!user) {
                    res.status(200).json({ status: false, message: "dont exist user" });
                    return;
                }
                const userUpdate = Object.assign(Object.assign({}, user), { first_name: first_name, last_name: last_name, city: city, state: state, country: country, is_init: 1 });
                const updateUser = yield users_1.default.update(userUpdate);
                res.status(200).json({ status: true, user: updateUser });
                return;
            }
            catch (err) {
                res.status(500).json(err);
                return;
            }
        });
        this.success = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                message: "User successfully created",
            });
        });
        this.mailVerify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { random, email } = req.body;
            const accountlist = yield account_type_1.default.readAll();
            if (accountlist.length == 0) {
                res.status(200).json({ staus: false, message: "there is no accout type" });
                return;
            }
            try {
                if (email != "" && email) {
                    const valueObjec = yield this.redisHandle.getObject(email);
                    if (random == valueObjec.random) {
                        let firstLevel = yield account_type_1.default.readAll();
                        let firstLevelId = firstLevel[0].id;
                        yield this.createUserRecord("", email, valueObjec.password, "", "", "", "", "", "", firstLevelId, res);
                    }
                    else {
                        res.status(200).json({
                            status: false,
                            message: "code is wrong!"
                        });
                    }
                }
                else {
                    res.status(200).json({
                        status: false,
                        message: "email is invalid"
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    error: error
                });
            }
        });
        this.create_profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, first_name, last_name, city, state, country, isUpdate } = req.body;
            if (!email) {
                res.status(200).json({
                    status: false,
                    message: "Email is Invalid"
                });
                return;
            }
            try {
                // const url = req.protocol +"://"+req.get('host');
                const user = yield users_1.default.readByEmail(email);
                if (!user) {
                    res.status(200).json({ status: false, message: "dont exist user" });
                    return;
                }
                const userUpdate = Object.assign(Object.assign({}, user), { first_name: first_name, last_name: last_name, city: city, state: state, country: country, is_init: 1, image_url: req['file'].filename });
                const updateUser = yield users_1.default.update(userUpdate);
                res.status(200).json({ status: true, user: updateUser });
                return;
            }
            catch (err) {
                res.status(500).json(err);
                return;
            }
        });
        this.getProfileImg = (req, res, next) => {
            const action = req.query.img;
            var filePath = path.join(__dirname, "../../../uploads/profile", action).split("%20").join(" ");
            // var filePath = path.join(__dirname,"../../uploads/profile",action).split("%20").join(" ");
            console.log("file path", filePath);
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });
                    res.end("404 Not Found");
                    return;
                }
                var ext = path.extname(action);
                var contentType = "text/plain";
                if (ext === ".png") {
                    contentType = "image/png";
                }
                else if (ext === ".jpg" || ext === ".jpeg") {
                    contentType = "image/jpeg";
                }
                res.set('Access-Control-Allow-Origin', '*');
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.writeHead(200, {
                    "Content-Type": contentType,
                    "Access-Control-Allow-Origin": "*"
                });
                fs.readFile(filePath, (err, content) => {
                    res.end(content);
                });
            });
        };
        this.forgotMail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(200).json({ status: false, message: "Please input email correctly" });
            }
            try {
                const userRecord = yield users_1.default.readByEmail(email);
                if (!userRecord) {
                    return res.status(200).json({ status: false, message: "There is no registered email" });
                }
                const random = (0, utils_1.generateRandom)();
                console.log("random", random);
                yield this.redisHandle.setObject(random.toString(), { email: email }, 1000 * 60);
                const base_url = req.protocol + '://' + req.get('host');
                yield (0, nodemailer_1.sendEmail)(email, "Verify Email", "<html><body><a href=" + base_url + "/setNewPassword/" + random + ">" + base_url + "/setNewPassword/" + random + "</a></body></html>");
                // await sendEmail(email,"Verify Email","<html><body><h1>"+random+"</h1></body></html>");
                res.status(200).json({
                    status: true,
                    message: "email is sent"
                });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.setNewPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, password } = req.body;
            if (!id || !password)
                return res.status(200).json({ status: false, message: "Please input parameter correctly" });
            try {
                const cacheObject = yield this.redisHandle.getObject(id);
                if (!(cacheObject === null || cacheObject === void 0 ? void 0 : cacheObject.email)) {
                    return res.status(200).json({ status: false, message: "Invalid hash!" });
                }
                const email = cacheObject.email;
                const userRecord = yield users_1.default.readByEmail(email);
                if (!userRecord) {
                    return res.status(200).json({ status: false, message: "There is not user" });
                }
                bcrypt.hash(password, 12).then((hash) => __awaiter(this, void 0, void 0, function* () {
                    userRecord.password = hash;
                    yield users_1.default.update(userRecord);
                    return res.status(200).json({ status: true, message: "Updating password is successful!" });
                }));
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.signIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
                if (err || !user) {
                    return res.status(400).json({
                        message: 'Incorrect username or password',
                        status: false
                    });
                }
                req.login(user, { session: false }, (err) => {
                    if (err)
                        res.send(err);
                });
                const token = (0, refreshToken_1.getToken)({ jid: user.id });
                // const refreshToken = getRefreshToken({rid:user.id});
                redis_1.default.getInstance().setObject(user.id.toString(), {
                    refresh_token: token,
                    expires: eval(utils_1.REFRESH_CONFIG.expiry)
                });
                // Set browser httpOnly cookies
                res.cookie("jwt", token, {
                    secure: true,
                    httpOnly: true,
                });
                return res.json({ status: true, token });
            })(req, res);
        });
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(200).json({
                    status: false,
                    message: "password or email is invalid"
                });
                return;
            }
            const random = (0, utils_1.generateRandom)();
            console.log("random", random);
            try {
                yield this.redisHandle.setObject(email, { random: random, password: password }, 1000 * 60);
                yield (0, nodemailer_1.sendEmail)(email, "Verify Email", "<html><body><h1>" + random + "</h1></body></html>");
                res.status(200).json({
                    status: true,
                    message: "email is sent"
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    error: error
                });
            }
        });
        this.createUserRecord = (username, email, password, first_name, last_name, city, state, country, image_url, account_type_id, res) => __awaiter(this, void 0, void 0, function* () {
            bcrypt.hash(password, 12).then((hash) => __awaiter(this, void 0, void 0, function* () {
                if (email && password) {
                    yield users_1.default.create({
                        username: username,
                        email: email,
                        password: hash,
                        first_name: first_name,
                        last_name: last_name,
                        city: city,
                        state: state,
                        country: country,
                        image_url: image_url,
                        is_admin: 0,
                        account_type: account_type_id,
                        created_at: new Date()
                    })
                        .then((user) => {
                        const token = (0, refreshToken_1.getToken)({ jid: user.id });
                        redis_1.default.getInstance().setObject(user.id.toString(), {
                            refresh_token: token,
                            expires: utils_1.REFRESH_CONFIG.expiry
                        });
                        res.cookie("jwt", token, {
                            secure: false,
                            httpOnly: true
                        });
                        // const refreshToken = getRefreshToken({id:user.id});
                        // this.redisHandle.setObject(user.id!.toString(),{
                        //    refresh_token:refreshToken,
                        //    expires:REFRESH_CONFIG.expiry
                        // })
                        // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                        res.send({ status: true, token: token });
                    })
                        .catch((error) => res.status(400).json({
                        message: "User not successful created",
                        error: error.message,
                        status: false
                    }));
                }
                else {
                    res.status(400).json({
                        message: "User not successful created Invalid data",
                        status: false
                    });
                }
            }));
            return;
        });
        this.backImg = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const action = req.query.img;
            var filePath = path.join(__dirname, "../../../uploads/background", action).split("%20").join(" ");
            // var filePath = path.join(__dirname,"../../uploads/profile",action).split("%20").join(" ");
            console.log("file path", filePath);
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });
                    res.end("404 Not Found");
                    return;
                }
                var ext = path.extname(action);
                var contentType = "text/plain";
                if (ext === ".png") {
                    contentType = "image/png";
                }
                else if (ext === ".jpg" || ext === ".jpeg") {
                    contentType = "image/jpeg";
                }
                res.set('Access-Control-Allow-Origin', '*');
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.writeHead(200, {
                    "Content-Type": contentType,
                    "Access-Control-Allow-Origin": "*"
                });
                fs.readFile(filePath, (err, content) => {
                    res.end(content);
                });
            });
        });
        this.getBackground = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const backRecord = yield background_1.default.readByAll();
                if (backRecord.length) {
                    return res.status(200).json({ status: true, back: backRecord[0].url });
                }
                else {
                    return res.status(200).json({ status: false });
                }
            }
            catch (error) {
                console.log("error", error);
                return res.status(500).json({ status: false });
            }
        });
        this.profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send(req.user);
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, first_name, last_name, city, state, country, image_url, is_admin } = req.body;
            bcrypt.hash(password, 12).then((hash) => __awaiter(this, void 0, void 0, function* () {
                if (username && email && password && first_name && last_name && city && state && country && is_admin !== undefined && is_admin !== null) {
                    yield users_1.default.create({
                        username: username,
                        email: email,
                        password: hash,
                        first_name: first_name,
                        last_name: last_name,
                        city: city,
                        state: state,
                        country: country,
                        image_url: image_url,
                        is_admin: is_admin,
                        created_at: new Date()
                    })
                        .then((user) => res.status(200).json({
                        message: "User successfully created",
                        user,
                    }))
                        .catch((error) => res.status(400).json({
                        message: "User not successful created",
                        error: error.message,
                    }));
                }
                else {
                    res.status(400).json({
                        message: "User not successful created Invalid data",
                    });
                }
            }));
        });
        this.logOut = (req, res, next) => {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json({ status: true });
            });
        };
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map