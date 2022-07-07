"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const firebase_admin_1 = require("firebase-admin");
class UserController {
    constructor() {
        this.addUser = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                const userRecord = yield (0, firebase_admin_1.auth)().createUser({
                    email: user.email,
                    emailVerified: true,
                    password: user.password,
                    displayName: user.name,
                });
                const uid = userRecord.uid;
                yield (0, firebase_admin_1.firestore)().collection('users').doc(uid).set(Object.assign({}, user));
                return {
                    success: true,
                    newUser: Object.assign(Object.assign({}, user), { id: uid })
                };
            }
            catch (err) {
                console.log(err === null || err === void 0 ? void 0 : err.message);
                return {
                    success: false,
                    error: err === null || err === void 0 ? void 0 : err.message
                };
            }
        });
        this.editUser = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                yield (0, firebase_admin_1.auth)().updateUser(user.id, {
                    email: user.email,
                });
                yield (0, firebase_admin_1.firestore)().collection('users').doc(user.id).set(Object.assign({}, user), { merge: true });
                return {
                    success: true
                };
            }
            catch (err) {
                console.log(err);
                return {
                    success: false,
                    error: err === null || err === void 0 ? void 0 : err.message
                };
            }
        });
        this.deleteUser = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { users, role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                const promises = users.map((user) => (0, firebase_admin_1.firestore)().collection('users').doc(user).delete());
                yield (0, firebase_admin_1.auth)().deleteUsers(users);
                yield Promise.all(promises);
                return {
                    success: true
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in deleteUsers!');
            }
        });
        this.getUsers = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                const snap = yield (0, firebase_admin_1.firestore)().collection('users').get();
                const docs = snap.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { id: doc.id })));
                return {
                    success: true,
                    users: docs
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getUsers!');
            }
        });
        this.getUser = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const user = (yield (0, firebase_admin_1.firestore)().collection('users').doc(id).get()).data();
                return {
                    success: true,
                    user: Object.assign(Object.assign({}, user), { id })
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getUser!');
            }
        });
    }
}
module.exports = new UserController();
