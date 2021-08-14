"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
// Telling typescript what type of subject (name of channel in NATS)
// enum does oblige to use as params items assigned in object Subject
var Subjects;
(function (Subjects) {
    Subjects["TicketCreated"] = "ticket:created";
    Subjects["TicketUpdated"] = "ticket:updated";
    Subjects["OrderUpdated"] = "order:updated";
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderCancelled"] = "order:cancelled";
    Subjects["ExpirationComplete"] = "expiration:complete";
    Subjects["PaymentCreated"] = "payment:created";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
