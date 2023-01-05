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
const ws_1 = require("ws");
const socketList_1 = require("./socketList");
const types_1 = require("./types");
const notificationController_1 = require("../controllers/notificationController");
const users_1 = require("../repositories/users");
const project_1 = require("../repositories/project");
class ServerSocket {
    constructor(httpServer) {
        this.socketlists = new socketList_1.default();
        this.sendNotificatonForUser = (user_id) => __awaiter(this, void 0, void 0, function* () {
        });
        this.sendNotificationForAllUser = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const notDataForAllUser = yield this.notification.getNotificationForAllUser();
                if (notDataForAllUser) {
                    this.socketlists.socketList.map(item => {
                        this.sendMessage(item.socket, { type: "all_note", content: { status: true, notification: notDataForAllUser } });
                    });
                }
            }
            catch (error) {
                console.log("send NotificationFor All User Error", error);
            }
        });
        this.serverSock = new ws_1.Server({ server: httpServer });
        this.notification = new notificationController_1.default();
        this.listen();
    }
    lifTime(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let total_power = 0;
                let cur_power = 0;
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const totalSupportRecords = yield project_1.default.readSupportTillTime(user_id, new Date());
                totalSupportRecords.map((item) => {
                    total_power += item.total_power;
                });
                const curPowers = yield project_1.default.readSupportBetweenTime(user_id, firstDay, new Date());
                curPowers.map((item) => {
                    cur_power += item.total_power;
                });
                console.log("total power lis", total_power, cur_power);
                return { total_power: total_power, cur_power: cur_power };
            }
            catch (error) {
                console.log("lift time error", error);
            }
        });
    }
    sendNotificatonforUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const growMembers = yield this.notification.getConnNotification(user_id);
                const supportReachedProject = yield this.notification.getSupportReachNotification(user_id);
                const inviteNotification = yield this.notification.getInviteforUser(user_id);
                const liftTime = yield this.lifTime(user_id);
                const result = {
                    status: true,
                    grow_mem_week: growMembers,
                    supportReachedPorjects: supportReachedProject.reached,
                    supportProjects: supportReachedProject.support_projects,
                    accept_note: inviteNotification.accept_note,
                    joind_note: inviteNotification.joind_note,
                    network_note: inviteNotification.network_note,
                    upgrade_note: inviteNotification.upgrade_note,
                    grow_members: inviteNotification.grow_members,
                    life_time: liftTime,
                    total_members: inviteNotification.total_members
                };
                const socket = this.socketlists.getUser(user_id);
                if (socket) {
                    this.sendMessage(socket.socket, { type: "for_user", content: result });
                    return;
                }
            }
            catch (error) {
                console.log("sendNotification for user error:", error);
            }
        });
    }
    parseParket(parket, socket) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jsonData = JSON.parse(parket);
            const type = jsonData.type;
            switch (type) {
                case types_1.PARKET_TYPE.INIT:
                    const user_email = (_a = jsonData.content) === null || _a === void 0 ? void 0 : _a.email;
                    if (user_email === "")
                        return;
                    const user_record = yield users_1.default.readByEmail(user_email);
                    if (!user_record)
                        return;
                    const user_id = user_record.id;
                    this.socketlists.addUser(user_id, socket);
                    this.sendNotificationForAllUser();
                    this.sendNotificatonforUser(user_id);
                    break;
                default:
                    ;
            }
        });
    }
    sendMessage(socket, jsonData) {
        socket.send(JSON.stringify(jsonData));
    }
    listen() {
        console.log("socket initialize");
        this.serverSock.on('connection', (socket) => {
            socket.send(JSON.stringify({
                type: "init",
                content: [1, "2"]
            }));
            // receive a message from the client
            socket.on("message", (data) => {
                // console.log("message",data)
                try {
                    this.parseParket(data, socket);
                }
                catch (error) {
                    console.log("error", error);
                    // socket.send(error.status.toString());
                }
            });
            socket.on("close", () => {
                this.socketlists.removeUser(socket);
                console.log("close---------", this.socketlists.socketList.length);
            });
        });
    }
}
exports.default = ServerSocket;
//# sourceMappingURL=index.js.map