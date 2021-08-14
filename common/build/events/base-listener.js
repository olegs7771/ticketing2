"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
// <T extends Event> if we gonna use class Listener to extend it we must provide some custom type for this.
// <T extends Event> like generic argument for the types
// so we can reffer to type T everywhere inside class definition
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000;
        this.client = client;
    }
    Listener.prototype.subscriptionOption = function () {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOption());
        subscription.on('message', function (msg) {
            console.log("Message received: " + _this.subject + " / " + _this.queueGroupName);
            var parsedData = _this.parseMessage(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        //returns either string or buffer
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    };
    return Listener;
}());
exports.Listener = Listener;
