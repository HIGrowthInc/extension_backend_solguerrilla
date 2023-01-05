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
const users_1 = require("../repositories/users");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log(email);
        if (email && email !== "") {
            const user = yield users_1.default.readByEmail(email);
            if (user) {
                res.status(200).json({
                    message: "Email is using now",
                });
            }
            else {
                next();
            }
        }
        else {
            res.status(200).json({
                message: "Invalid value",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
});
//# sourceMappingURL=mailChecker.js.map