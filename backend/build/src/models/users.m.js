"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.login = exports.register = void 0;
const db_1 = require("../config/db");
// Registr new user db
const register = async ({ email, password, name }) => {
    try {
        const newUser = await db_1.db.transaction(async (trx) => {
            const [userId] = await trx('users').insert({ name, email }).returning('id');
            await trx('passwords').insert({ user_id: userId, hashed_password: password });
            return { id: userId, email, name };
        });
        return newUser;
    }
    catch (error) {
        console.error('Error at  models registration new user', error);
        throw new Error('Registration failed');
    }
};
exports.register = register;
//Login db
const login = async (email) => {
    try {
        const isUser = await db_1.db.transaction(async (trx) => {
            const user = await trx('users').select('id', 'email').where({ email }).first();
            const userPassword = await trx('passwords').select('hashed_password').where({ userId: user.id });
            const selecteUser = { ...user, password: userPassword };
            return selecteUser;
        });
        return isUser;
    }
    catch (error) {
        console.error('Error at models login', error);
        throw new Error('Login failed');
    }
};
exports.login = login;
//Get all users db
const all = async () => {
    try {
        const users = await (0, db_1.db)('users').select('id', 'email', 'name').orderBy('name');
        return users;
    }
    catch (error) {
        console.error('Error models get all users', error);
        throw new Error('Could not get all users');
    }
};
exports.all = all;
