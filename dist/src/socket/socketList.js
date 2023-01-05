"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketList {
    constructor() {
        this.sockHash = new Map();
        this.socketList = [];
    }
    addUser(user_id, socket) {
        const exist = this.existingUser({ user_id, socket });
        if (exist) {
            return { error: "User is taken" };
        }
        const user = { user_id, socket };
        this.socketList.push({ user_id, socket });
        this.sockHash.set(socket, user_id);
        return { user };
    }
    removeUser(socket) {
        const user_id = this.sockHash.get(socket);
        const index = this.socketList.findIndex((user) => {
            return user.user_id === user_id;
        });
        if (index !== 1) {
            console.log("index----------", index);
            this.sockHash.delete(socket);
            return this.socketList.splice(index, 1)[0];
        }
    }
    getUser(user_id) {
        return this.socketList.find((user) => user.user_id === user_id);
    }
    existingUser(user) {
        return this.socketList.find(item => {
            return item.user_id === user.user_id;
        });
    }
}
exports.default = SocketList;
//# sourceMappingURL=socketList.js.map