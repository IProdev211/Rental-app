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
class ReserveController {
    constructor() {
        this.addReserve = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { from, to, user, bike } = req.body;
                const ref = yield (0, firebase_admin_1.firestore)().collection('reserves').add({
                    from,
                    to,
                    user,
                    bike
                });
                const promises = [
                    new Promise((resolve, reject) => {
                        (0, firebase_admin_1.firestore)().collection('bikes').doc(bike).get().then((doc) => {
                            resolve(Object.assign(Object.assign({}, doc.data()), { id: bike }));
                        });
                    }),
                    new Promise((resolve, reject) => {
                        (0, firebase_admin_1.firestore)().collection('users').doc(user).get().then((doc) => {
                            resolve(Object.assign(Object.assign({}, doc.data()), { id: user }));
                        });
                    })
                ];
                const res = yield Promise.all(promises);
                return {
                    success: true,
                    newReserve: {
                        from,
                        to,
                        user: res[1],
                        bike: res[0],
                        id: ref.id
                    }
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in addReserve!');
            }
        });
        this.getReserves = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                const snap = yield (0, firebase_admin_1.firestore)().collection('reserves').get();
                const promises = snap.docs.map((doc) => {
                    return new Promise((resolve, reject) => {
                        const reserveData = doc.data();
                        const reserveId = doc.id;
                        (0, firebase_admin_1.firestore)().collection('bikes').doc(reserveData === null || reserveData === void 0 ? void 0 : reserveData.bike).get().then((bikeDoc) => {
                            const bikeData = Object.assign(Object.assign({}, bikeDoc.data()), { id: reserveData === null || reserveData === void 0 ? void 0 : reserveData.bike });
                            (0, firebase_admin_1.firestore)().collection('users').doc(reserveData === null || reserveData === void 0 ? void 0 : reserveData.user).get().then((userDoc) => {
                                const userData = Object.assign(Object.assign({}, userDoc.data()), { id: reserveData === null || reserveData === void 0 ? void 0 : reserveData.user });
                                resolve(Object.assign(Object.assign({}, reserveData), { id: reserveId, bike: bikeData, user: userData }));
                            });
                        });
                    });
                });
                const reserves = yield Promise.all(promises);
                return {
                    success: true,
                    reserves: reserves
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getReserves!');
            }
        });
        this.getMyReserves = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const snap = yield (0, firebase_admin_1.firestore)().collection('reserves').where('user', '==', id).get();
                const promises = snap.docs.map((doc) => {
                    return new Promise((resolve, reject) => {
                        const reserveData = doc.data();
                        const reserveId = doc.id;
                        (0, firebase_admin_1.firestore)().collection('bikes').doc(reserveData === null || reserveData === void 0 ? void 0 : reserveData.bike).get().then((bikeDoc) => {
                            const bikeData = Object.assign(Object.assign({}, bikeDoc.data()), { id: reserveData === null || reserveData === void 0 ? void 0 : reserveData.bike });
                            (0, firebase_admin_1.firestore)().collection('users').doc(id).get().then((userDoc) => {
                                const userData = Object.assign(Object.assign({}, userDoc.data()), { id });
                                resolve(Object.assign(Object.assign({}, reserveData), { id: reserveId, bike: bikeData, user: userData }));
                            });
                        });
                    });
                });
                const reserves = yield Promise.all(promises);
                return {
                    success: true,
                    reserves: reserves
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getMyReserves!');
            }
        });
        this.cancelReserve = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, bike, newRating } = req.body;
                console.log(id, bike, newRating);
                const bikeRef = (0, firebase_admin_1.firestore)().collection('bikes').doc(bike);
                const promises = [
                    (0, firebase_admin_1.firestore)().collection('reserves').doc(id).delete(),
                    new Promise((resolve, reject) => {
                        bikeRef.get().then((bikeDoc) => {
                            const bikeData = bikeDoc.data();
                            const rating = (bikeData === null || bikeData === void 0 ? void 0 : bikeData.rating) || 0;
                            const rating_number = (bikeData === null || bikeData === void 0 ? void 0 : bikeData.rating_number) || 0;
                            bikeRef.set(Object.assign(Object.assign({}, bikeData), { rating: Math.floor((rating_number * rating + newRating) / (rating_number + 1)), rating_number: rating_number + 1 })).then(() => {
                                resolve();
                            });
                        });
                    })
                ];
                yield Promise.all(promises);
                const newBike = (yield bikeRef.get()).data();
                return {
                    success: true,
                    bike: Object.assign(Object.assign({}, newBike), { id: bike })
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in cancelReserve!');
            }
        });
    }
}
module.exports = new ReserveController();
