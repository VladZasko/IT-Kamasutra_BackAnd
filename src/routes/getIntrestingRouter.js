"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestingRouter = void 0;
const express_1 = __importDefault(require("express"));
const getInterestingRouter = (db) => {
    const router = express_1.default.Router();
    router.get('/books', (req, res) => {
        res.json({ title: 'books' });
    });
    router.get('/:id', (req, res) => {
        res.json({ title: 'data by id' + req.params.id });
    });
    return router;
};
exports.getInterestingRouter = getInterestingRouter;
