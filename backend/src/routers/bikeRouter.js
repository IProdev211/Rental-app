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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const bikeController_1 = __importDefault(require("../controllers/bikeController"));
const jwtAuthMiddleware_1 = require("../middleware/jwtAuthMiddleware");
class BikeRouter {
    constructor() {
        this._router = (0, express_1.Router)();
        this._controller = bikeController_1.default;
        this._configure();
    }
    get router() {
        return this._router;
    }
    /**
     * Connect routes to their matching controller endpoints.
     */
    _configure() {
        this._router.get('/getAll', jwtAuthMiddleware_1.authenticateJWT, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._controller.getBikes(req);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        }));
        this._router.get('/filter', jwtAuthMiddleware_1.authenticateJWT, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._controller.getFilteredBikes(req);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        }));
        this._router.post('/add', jwtAuthMiddleware_1.authenticateJWT, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._controller.addBike(req);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        }));
        this._router.put('/edit', jwtAuthMiddleware_1.authenticateJWT, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._controller.editBike(req);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        }));
        this._router.delete('/delete', jwtAuthMiddleware_1.authenticateJWT, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._controller.deleteBike(req);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        }));
    }
}
module.exports = new BikeRouter().router;
