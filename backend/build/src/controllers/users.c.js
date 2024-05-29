"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._all = exports._login = exports._register = void 0;
const users_m_1 = require("../models/users.m");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const _register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const lowerEmail = email.toLowerCase();
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(password + '', salt);
        const newUser = await (0, users_m_1.register)({
            email: lowerEmail,
            password: hashedPassword,
            name: name
        });
        res.json(newUser);
    }
    catch (error) {
        console.error("Error in controllers _register", error);
        res.status(400).json({ msg: 'Email already exist' });
    }
};
exports._register = _register;
const _login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, users_m_1.login)(email.toLowerCase());
        if (!user) {
            return res.status(404).json({ msg: 'Email not found' });
        }
        const isMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ msg: 'Wrong password' });
        }
        const { id: userId, email: userEmail } = user;
        const secret = process.env.ACCESS_TOKEN_SECRET || '19MynameisMaksim91';
        const accessToken = jsonwebtoken_1.default.sign({ userId, userEmail }, secret, { expiresIn: '60s' });
        res.cookie('token', accessToken, {
            maxAge: 60 * 1000,
            httpOnly: true
        });
        res.json({
            token: accessToken,
            id: userId,
            email: userEmail,
            name: userEmail
        });
    }
    catch (error) {
        console.error('Error in controllers _login', error);
        res.status(500).json({ msg: 'Something wen wrong' });
    }
};
exports._login = _login;
const _all = async (req, res) => {
    try {
        const users = await (0, users_m_1.all)();
        res.json(users);
    }
    catch (error) {
        console.error('Error in controllers _all', error);
        res.status(500).json({ msg: 'Could not fetch users' });
    }
};
exports._all = _all;
