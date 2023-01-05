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
exports.setupSolanaCronJobMap = void 0;
const cron = require("node-cron");
// hash map to map keys to jobs
const jobMap = new Map();
const setupSolanaCronJobMap = () => __awaiter(void 0, void 0, void 0, function* () {
    const determineJob = cron.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (e) {
            console.error('determineJob Error: ', e);
        }
    }), { scheduled: false }).start();
    const refundStatusUpdateJob = cron.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (e) {
            console.error('refundStatusUpdateJob Error: ', e);
        }
    }), { scheduled: false }).start();
});
exports.setupSolanaCronJobMap = setupSolanaCronJobMap;
//# sourceMappingURL=solanaCronManager.js.map