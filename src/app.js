"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBodyMiddleWare = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const courses_router_1 = require("./routes/courses.router");
const db_1 = require("./db/db");
const tests_1 = require("./routes/tests");
const users_router_1 = require("./routes/users.router");
const routerPaths_1 = require("./routerPaths");
exports.app = (0, express_1.default)();
exports.jsonBodyMiddleWare = express_1.default.json();
exports.app.use(exports.jsonBodyMiddleWare);
exports.app.use(routerPaths_1.RouterPaths.courses, (0, courses_router_1.getCoursesRouter)(db_1.db));
exports.app.use(routerPaths_1.RouterPaths.users, (0, users_router_1.getUsersRouter)(db_1.db));
exports.app.use(routerPaths_1.RouterPaths.__tests__, (0, tests_1.getTestsRouter)(db_1.db));
/*app.use("/interesting", getInterestingRouter(db))*/ 
