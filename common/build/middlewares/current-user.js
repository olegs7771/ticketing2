"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var currentUser = function (req, res, next) {
    // first we check req.session then check req.session.jwt
    // ? sign equal to req.session||req.session.jwt
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        //if no jwt in req.session then move to next middleware
        return next();
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
        req.user = decoded;
    }
    catch (error) { }
    next();
};
exports.currentUser = currentUser;
