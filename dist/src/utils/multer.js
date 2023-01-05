"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-null-keyword
const multer = require("multer");
const Storage = (dir, root) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            if (file)
                cb(null, root + dir);
        },
        filename: function (req, file, cb) {
            var _a;
            const fileName = (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.split(" ");
            cb(null, Date.now() + (fileName === null || fileName === void 0 ? void 0 : fileName.join("_")));
        }
    });
};
const fileFilter = (req, file, cb) => {
    console.log("file", file);
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const getUpload = (dir, root = "./uploads") => {
    const storage = Storage(dir, root);
    const upload = multer({
        storage,
        limits: { fileSize: "5MB",
            fieldSize: "5MB" },
        fileFilter,
    });
    return upload;
};
exports.default = getUpload;
//# sourceMappingURL=multer.js.map