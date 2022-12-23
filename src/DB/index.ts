require("dotenv").config();
const mysql  = require("mysql2");

const config={
    host:process.env.HOST || "localhost",
    port:process.env.DATABASE_PORT || 3306,
    database:process.env.DATABASE || "extension_db",
    user:process.env.USER || "root",
    password: process.env.PASSWORD || "",
}

class DB{
    private static _instance :DB;
    public connection:any;
    constructor(){
        this.connection = mysql.createConnection(config);
        console.log("successful connected")
    }

    static getInstance(){
        if (!DB._instance) {
            DB._instance = new DB();
        }
        return DB._instance;
    }
}
export default  DB;