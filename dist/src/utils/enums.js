"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardType = exports.BattleStatus = exports.ServiceType = exports.NetworkType = exports.ActivityType = void 0;
var ActivityType;
(function (ActivityType) {
    ActivityType["Transfer"] = "Transfer";
    ActivityType["Staked"] = "Staked";
    ActivityType["Unstaked"] = "Unstaked";
    ActivityType["Betted"] = "Betted";
})(ActivityType = exports.ActivityType || (exports.ActivityType = {}));
var NetworkType;
(function (NetworkType) {
    NetworkType["ETH"] = "Ethereum";
    NetworkType["SOL"] = "Solana";
    NetworkType["ADA"] = "Cardano";
    NetworkType["POLYGON"] = "Polygon";
})(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["Cron"] = "Cron";
    ServiceType["PastEvent"] = "PastEvent";
    ServiceType["Contract"] = "Contract";
})(ServiceType = exports.ServiceType || (exports.ServiceType = {}));
var BattleStatus;
(function (BattleStatus) {
    BattleStatus["Created"] = "Created";
    BattleStatus["RequestRandomWords"] = "RequestRandomWords";
    BattleStatus["Fulfilled"] = "Fulfilled";
    BattleStatus["Finalized"] = "Finalized";
    BattleStatus["RefundSet"] = "Refund";
    BattleStatus["Determine"] = "Determine";
})(BattleStatus = exports.BattleStatus || (exports.BattleStatus = {}));
var RewardType;
(function (RewardType) {
    RewardType[RewardType["ABP"] = 0] = "ABP";
    RewardType[RewardType["ETH"] = 1] = "ETH";
})(RewardType = exports.RewardType || (exports.RewardType = {}));
//# sourceMappingURL=enums.js.map