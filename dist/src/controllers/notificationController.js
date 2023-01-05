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
const connection_1 = require("../repositories/connection");
const notification_1 = require("../repositories/notification");
const support_project_1 = require("../repositories/support_project");
const progress_1 = require("../repositories/progress");
const invite_1 = require("../repositories/invite");
const connection_2 = require("../repositories/connection");
const upgrade_1 = require("../repositories/upgrade");
class NotificationController {
    constructor() {
        this.getNotificationForAllUser = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                const notificationData = yield notification_1.default.readNotification(before_week, now);
                return notificationData;
            }
            catch (error) {
                console.log("error", error);
                return null;
            }
        });
        this.getConnNotification = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            const recordOfthisMonth = yield connection_2.default.readMaxTotalMember(user_id, before_week, now);
            let grow_members;
            if (!recordOfthisMonth) {
                grow_members = 0;
            }
            else {
                grow_members = recordOfthisMonth.max_member - recordOfthisMonth.min_member;
            }
            return grow_members;
        });
        this.getSupportReachNotification = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            const support_projects = yield support_project_1.default.readSupportProjectFull(user_id);
            const project_ids = support_projects.map((item) => {
                return item.project_id.toString();
            });
            const projectSupported = yield progress_1.default.readAllReachedByGroupWithProjectIds(project_ids);
            return {
                reached: projectSupported,
                support_projects: support_projects
            };
        });
        this.getInviteforUser = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            const accept_records = yield invite_1.default.readAcceptRecords(user_id, before_week, now);
            const joind_records = yield invite_1.default.readJoinRecords(user_id, before_week, now);
            const connection_records = yield connection_2.default.readWithUserNotification(user_id, before_week, now);
            const upgrade_record = yield upgrade_1.default.readLatestRecrodByDate(user_id);
            const curTime = new Date();
            const lastDayofMonth = new Date(curTime.getFullYear(), curTime.getMonth() + 1, 0);
            const firstDayofbeforeMonth = new Date(curTime.getFullYear(), curTime.getMonth(), 1);
            const total_members_records = yield connection_1.default.readLatestConnectionByUserId(user_id);
            const total_members = (total_members_records === null || total_members_records === void 0 ? void 0 : total_members_records.total_member) ? total_members_records === null || total_members_records === void 0 ? void 0 : total_members_records.total_member : 0;
            const recordOfthisMonth = yield connection_2.default.readMaxTotalMember(user_id, firstDayofbeforeMonth, lastDayofMonth);
            let grow_members;
            if (!recordOfthisMonth) {
                grow_members = 0;
            }
            else {
                grow_members = recordOfthisMonth.max_member - recordOfthisMonth.min_member;
            }
            return {
                accept_note: accept_records,
                joind_note: joind_records,
                network_note: connection_records,
                upgrade_note: upgrade_record,
                grow_members: grow_members,
                total_members: total_members
            };
        });
        this.getNotificationForUser = (user_id) => __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = NotificationController;
//# sourceMappingURL=notificationController.js.map