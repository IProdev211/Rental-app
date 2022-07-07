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
class BikeController {
    constructor() {
        this.addBike = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { bike, role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                const ref = yield (0, firebase_admin_1.firestore)().collection('bikes').add(Object.assign(Object.assign({}, bike), { rating: 0, isForRental: false }));
                return {
                    success: true,
                    newBike: Object.assign(Object.assign({}, bike), { rating: 0, isForRental: false, id: ref.id })
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in addBike!');
            }
        });
        this.editBike = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { bike, role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                yield (0, firebase_admin_1.firestore)().collection('bikes').doc(bike.id).set(Object.assign({}, bike), { merge: true });
                return {
                    success: true
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in editBike!');
            }
        });
        this.deleteBike = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { bikes, role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Permission Error');
                }
                const promises = bikes.map((bike) => (0, firebase_admin_1.firestore)().collection('bikes').doc(bike.id).delete());
                yield Promise.all(promises);
                return {
                    success: true
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in deleteBikes!');
            }
        });
        this.getBikes = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.body;
                if (role !== 'manager') {
                    throw new Error('Error in getBikes! Permission Error');
                }
                const snap = yield (0, firebase_admin_1.firestore)().collection('bikes').get();
                const docs = snap.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { id: doc.id })));
                return {
                    success: true,
                    bikes: docs
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getBikes!');
            }
        });
        this.getFilteredBikes = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { from, to, model, location, color, rating } = req.query;
                let query = (0, firebase_admin_1.firestore)().collection('bikes').where('isForRental', '==', true);
                if (model) {
                    query = query.where('model', '==', model);
                }
                if (location) {
                    query = query.where('location', '==', location);
                }
                if (color) {
                    query = query.where('color', '==', color);
                }
                if (rating) {
                    query = query.where('rating', '==', Number(rating));
                }
                let rentedBikes = [];
                if (from && to) {
                    rentedBikes =
                        (yield (0, firebase_admin_1.firestore)().collection('reserves').get()).docs
                            .map((doc) => doc.data())
                            .filter((item) => item && !(item.to <= Number(from) && item.to <= Number(to) || item.from >= Number(from) && item.from >= Number(to)))
                            .map((item) => item.bike);
                }
                else {
                    rentedBikes =
                        (yield (0, firebase_admin_1.firestore)().collection('reserves').get()).docs
                            .map((doc) => doc.data())
                            .map((item) => item.bike);
                }
                console.log(rentedBikes);
                rentedBikes = [...new Set(rentedBikes)];
                if (rentedBikes.length) {
                    query = query.where('id', 'not-in', rentedBikes);
                }
                const snap = yield query.get();
                if (snap.empty) {
                    return {
                        success: true,
                        bikes: []
                    };
                }
                const docs = snap.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { id: doc.id })));
                return {
                    success: true,
                    bikes: docs
                };
            }
            catch (err) {
                console.log(err);
                throw new Error('Error in getFilteredBikes!');
            }
        });
    }
}
module.exports = new BikeController();
