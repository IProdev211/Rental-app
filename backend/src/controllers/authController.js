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
class AuthController {
    constructor() {
        this.signInWithToken = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { idToken } = req.body;
                const decodedToken = yield (0, firebase_admin_1.auth)().verifyIdToken(idToken);
                const uid = decodedToken.uid;
                const user = (yield (0, firebase_admin_1.firestore)().collection('users').doc(uid).get()).data();
                return {
                    success: true,
                    user: Object.assign(Object.assign({}, user), { id: uid })
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in signIn!');
            }
        });
        this.signUp = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userInfo } = req.body;
                const userRecord = yield (0, firebase_admin_1.auth)().createUser({
                    email: userInfo.email,
                    emailVerified: true,
                    password: userInfo.password,
                    displayName: userInfo.name,
                });
                const uid = userRecord.uid;
                yield (0, firebase_admin_1.firestore)().collection('users').doc(uid).set({
                    email: userInfo.email,
                    name: userInfo.name,
                    role: 'user',
                });
                return {
                    success: true,
                    userInfo: ({
                        email: userInfo.email,
                        name: userInfo.name,
                        role: userInfo.role,
                        id: uid
                    })
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in signup!');
            }
        });
    }
}
module.exports = new AuthController();
