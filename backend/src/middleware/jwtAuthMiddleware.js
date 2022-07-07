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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const firebase_admin_1 = require("firebase-admin");
const authenticateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const idToken = authHeader.split(' ')[1];
        (0, firebase_admin_1.auth)()
            .verifyIdToken(idToken)
            .then(function (decodedToken) {
            (0, firebase_admin_1.firestore)().collection('users').doc(decodedToken.uid).get().then((res) => {
                var _a;
                const role = (_a = res.data()) === null || _a === void 0 ? void 0 : _a.role;
                console.log(req.body);
                req.body = Object.assign(Object.assign({}, req.body), { role });
                return next();
            });
        })
            .catch(function (error) {
            return res.sendStatus(403);
        });
    }
    else {
        res.sendStatus(401);
    }
});
exports.authenticateJWT = authenticateJWT;
