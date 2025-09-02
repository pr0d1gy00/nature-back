"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArray = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // usar ruta absoluta ya creada
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Solo se permiten archivos de imagen y video"), false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
});
const uploadArray = (fieldName, maxCount) => {
    return (req, res, next) => {
        upload.array(fieldName, maxCount)(req, res, (err) => {
            if (err) {
                console.error("Error en Multer:", err.message);
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    };
};
exports.uploadArray = uploadArray;
