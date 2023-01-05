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
const errorHandler_1 = require("../handlers/errorHandler");
class UsersController {
    constructor() {
        /**
         * Validate if user registered
         * @param req
         * @param res
         * @param next
         */
        this.checkUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { address } = req.params;
            try {
                return res.status(200).json({
                    'success': true,
                    'message': '',
                    'data': false,
                });
            }
            catch (error) {
                (0, errorHandler_1.apiErrorHandler)(error, req, res, 'Check User failed.');
            }
        });
    }
}
exports.default = UsersController;
//# sourceMappingURL=usersController.js.map