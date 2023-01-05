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
exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
const sendEmail = (email, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: "accounts@solguerrilla.com",
                pass: "C2WzXO8q@21#5g!*",
            },
        });
        yield transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text,
        });
        console.log("email sent sucessfully");
    }
    catch (error) {
        console.log("email not sent");
        console.log(error);
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=nodemailer.js.map