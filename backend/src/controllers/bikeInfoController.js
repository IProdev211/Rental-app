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
class BikeInfoController {
    constructor() {
        this.getConstants = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = [
                    new Promise((resolve, reject) => {
                        (0, firebase_admin_1.firestore)().collection('colors').get().then((res) => {
                            const docs = res.docs;
                            const colors = docs.map((doc) => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.color; });
                            resolve(colors);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        (0, firebase_admin_1.firestore)().collection('locations').get().then((res) => {
                            const docs = res.docs;
                            const locations = docs.map((doc) => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.location; });
                            resolve(locations);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        (0, firebase_admin_1.firestore)().collection('models').get().then((res) => {
                            const docs = res.docs;
                            const models = docs.map((doc) => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.model; });
                            resolve(models);
                        });
                    }),
                ];
                const data = yield Promise.all(promises);
                return {
                    success: true,
                    data
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getConstants!');
            }
        });
    }
}
module.exports = new BikeInfoController();
