"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const bikeInfoRouter_1 = __importDefault(require("./bikeInfoRouter"));
const bikeRouter_1 = __importDefault(require("./bikeRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const reserveRouter_1 = __importDefault(require("./reserveRouter"));
class MasterRouter {
    constructor() {
        this._router = (0, express_1.Router)();
        this._auth = authRouter_1.default;
        this._bikeInfo = bikeInfoRouter_1.default;
        this._bike = bikeRouter_1.default;
        this._user = userRouter_1.default;
        this._reserve = reserveRouter_1.default;
        this._configure();
    }
    get router() {
        return this._router;
    }
    /**
     * Connect routes to their matching routers.
     */
    _configure() {
        this._router.use('/', this._auth);
        this._router.use('/', this._bikeInfo);
        this._router.use('/user', this._user);
        this._router.use('/bike', this._bike);
        this._router.use('/reserve', this._reserve);
    }
}
module.exports = new MasterRouter().router;
