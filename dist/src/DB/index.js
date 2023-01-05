"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mysql = require("mysql2");
const config = {
    host: "localhost",
    port: 3306,
    database: "extension_db",
    user: "user02",
    password: "12345678",
};
class DB {
    constructor() {
        console.log("confgig", config);
        this.connection = mysql.createConnection(config);
        console.log("successful connected");
    }
    static getInstance() {
        if (!DB._instance) {
            DB._instance = new DB();
        }
        return DB._instance;
    }
}
exports.default = DB;
//# sourceMappingURL=index.js.map