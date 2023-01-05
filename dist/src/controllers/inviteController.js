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
const invite_1 = require("../repositories/invite");
const nodemailer_1 = require("../utils/nodemailer");
const redis_1 = require("../utils/redis");
const connection_1 = require("../repositories/connection");
const account_type_1 = require("../repositories/account_type");
const upgrade_1 = require("../repositories/upgrade");
class InviteController {
    constructor() {
        this.redisHandle = redis_1.default.getInstance();
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                console.log("id", id);
                const { password, first_name, last_name } = req.body;
                const inviteRecord = yield invite_1.default.readByHash(id);
                if (!inviteRecord) {
                    return;
                }
                const email = inviteRecord.email;
                console.log("email", email);
                if (!password) {
                    res.status(200).json({
                        status: false,
                        message: "password is invalid"
                    });
                    return;
                }
                const random = (0, utils_1.generateRandom)();
                yield this.redisHandle.setObject(email, { random: random, password: password, first_name: first_name, last_name: last_name }, 1000 * 60);
                console.log("email", email);
                yield (0, nodemailer_1.sendEmail)(email, "Verify Email", "<html><body><h1>" + random + "</h1></body></html>");
                res.status(200).json({
                    status: true,
                    message: "Email is sent.please verify your email."
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
        this.invite_mailVerify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const { random } = req.body;
            const _accountlist = yield account_type_1.default.readAll();
            const accountlist = _accountlist[0];
            if (!accountlist) {
                res.status(200).json({ staus: false, message: "there is no accout type" });
                return;
            }
            try {
                // console.log("-------",id)
                const inviteRecord = yield invite_1.default.readByHash(id);
                console.log("invitere", inviteRecord);
                if (!inviteRecord)
                    return;
                if (inviteRecord.joined_at) {
                    res.status(200).json({ status: false, message: "you already joind" });
                    return;
                }
                const email = inviteRecord.email;
                if (email != "" && email) {
                    console.log("email", email);
                    const valueObjec = yield this.redisHandle.getObject(email);
                    console.log("hash compare", random == valueObjec.random);
                    if (random == valueObjec.random) {
                        let _firstLevelId = yield account_type_1.default.readAll();
                        const firstLevelId = _firstLevelId[0].id;
                        console.log("valueof", valueObjec);
                        const createdUser = yield this.createUserRecord("", email, valueObjec.password, valueObjec.first_name, valueObjec.last_name, "", "", "", firstLevelId, "", res);
                        inviteRecord.joind_at = new Date();
                        inviteRecord.is_joined = 1;
                        yield invite_1.default.update(inviteRecord);
                        const connRecord = yield this.createConnectionRecord(inviteRecord, createdUser.id);
                        res.status(200).json({ status: true, message: "Sucessfull!, Please login with extension!" });
                        return;
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
                res.status(500).json({ status: false, error: error });
            }
        });
        this.invite_accept = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            console.log("id", id);
            try {
                const inviteRecord = yield invite_1.default.readByHash(id);
                if (!inviteRecord) {
                    return;
                }
                if (inviteRecord.is_accept) {
                    res.status(200).json({ status: false, message: "you accepted already" });
                    return;
                }
                inviteRecord.is_accept = 1;
                inviteRecord.accept_at = new Date();
                yield invite_1.default.update(inviteRecord);
                res.status(200).json({ status: true, message: "successful" });
                // send sign up page to user
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.invite_mail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { fromEmail, toEmail } = req.body;
            if (!fromEmail || !toEmail) {
                res.status(200).json({
                    status: false,
                    message: "Invalid email"
                });
                return;
            }
            if (fromEmail == toEmail) {
                res.status(200).json({
                    status: false,
                    message: "you can't invite to you"
                });
                return;
            }
            const hash = (0, utils_1.generateRandom)().toString();
            try {
                const fromUser = yield users_1.default.readByEmail(fromEmail);
                if (!fromUser) {
                    res.status(200).json({
                        status: false,
                        message: "you are invalid user"
                    });
                    return;
                }
                const base_url = req.protocol + '://' + req.get('host');
                yield (0, nodemailer_1.sendEmail)(toEmail, "Verify Email", "<html><body><a href=" + base_url + "/invite/sign_up/" + hash + ">" + base_url + "/" + hash + "</a></body></html>");
                const inviteData = invite_1.default.makeInviteData(fromUser.id, toEmail, 0, 0, hash, new Date(), null, null);
                console.log("invitedata", inviteData);
                const inviteRecord = yield invite_1.default.create(inviteData);
                res.status(200).json({
                    status: true,
                    message: "invite successful!"
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
        this.invite = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log("id", id);
            // res.send()
        });
        // --------------------------function ---------------
        this.createUserRecord = (username, email, password, first_name, last_name, city, state, country, account_type, image_url, res) => __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt.hash(password, 12);
            const userRecord = yield users_1.default.create({
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
                account_type: account_type,
                created_at: new Date()
            });
            return userRecord;
        });
        this.createConnectionRecord = (inviteRecord, followId) => __awaiter(this, void 0, void 0, function* () {
            const user_id = inviteRecord.user_id;
            let totalMember = 0;
            const latestConnectRecordOfUser = yield connection_1.default.readLatestConnectionByUserId(user_id);
            if (latestConnectRecordOfUser) {
                totalMember = latestConnectRecordOfUser.total_member;
            }
            totalMember += 1;
            console.log("totalNumber", totalMember);
            const follow_id = followId;
            const create_at = new Date();
            const connectionData = connection_1.default.makeConnectionData(user_id, totalMember, follow_id, create_at);
            const connRecord = yield connection_1.default.create(connectionData);
            yield this.udpateAccountLevel(user_id, totalMember);
            return connRecord;
        });
        this.udpateAccountLevel = (user_id, total_member) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.readById(user_id);
            if (!user)
                return;
            const currentAccontType = yield account_type_1.default.readById(user.account_type);
            if (!currentAccontType)
                return;
            const toAccountType = yield account_type_1.default.readLevelWithMemCount(total_member);
            if (!toAccountType)
                return;
            if (currentAccontType.level < toAccountType.level) {
                user.account_type = toAccountType.id;
                const upgradeData = upgrade_1.default.makeSupportProjectData(user.id, toAccountType.id, new Date());
                yield upgrade_1.default.create(upgradeData);
                yield users_1.default.update(user);
            }
        });
    }
}
exports.default = InviteController;
//# sourceMappingURL=inviteController.js.map