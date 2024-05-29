"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.token || req.headers['x-access-token'];
    console.log('accessToken', accessToken);
    if (!accessToken) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const secret = process.env.ACCESS_TOKEN_SECRET || '19MynameisMaksim91';
    jsonwebtoken_1.default.verify(accessToken, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: err.message, msg: 'Frobidden' });
        }
        if (decoded) {
            req.user = decoded;
        }
        next();
    });
};
exports.verifyToken = verifyToken;
