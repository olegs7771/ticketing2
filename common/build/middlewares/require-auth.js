"use strict";
// This middleware coming only after currentUser middleware!
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var not_authorized_error_1 = require("../errors/not-authorized-error");
var requireAuth = function (req, res, next) {
    if (!req.user) {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    next();
};
exports.requireAuth = requireAuth;
