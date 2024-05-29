"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_c_1 = require("../controllers/users.c");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = express_1.default.Router();
router.post('/register', users_c_1._register);
router.post('/login', users_c_1._login);
router.get('/', verifyToken_1.verifyToken, users_c_1._all);
router.get('/verify', verifyToken_1.verifyToken, (req, res) => {
    res.sendStatus(200);
});
exports.default = router;
