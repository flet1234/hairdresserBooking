"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const users_r_1 = __importDefault(require("./routes/users.r"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.listen(process.env.Port || 3001, () => {
    console.log(`Running on ${process.env.Port || 3001}`);
});
app.use('/api/users', users_r_1.default);
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../frontEnd/dist')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../frontEnd/dist", 'index.html'));
});
