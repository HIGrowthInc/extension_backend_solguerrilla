require("dotenv").config();
const mysql  = require("mysql2");

const config={
    host: "localhost",
    port:3306,
    database: "extension_db",
    user: "user02",
    password: "12345678",
}

class DB{
    private static _instance :DB;
    public connection:any;
    constructor(){
        console.log("confgig",config)
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