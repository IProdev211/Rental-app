"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const routers_1 = __importDefault(require("./routers"));
const serviceAccount = require("./firebase/serviceAccountKey.json");
var bodyParser = require('body-parser');
dotenv_1.default.config();
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use((0, helmet_1.default)());
app.use('/api', routers_1.default);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port || 5000, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
