"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newOutputHandler = newOutputHandler;
function newOutputHandler() {
    var a = {
        outError: function (msg) {
            console.error(msg);
        },
        outLog: function (msg) {
            console.log(msg);
        }
    };
    return a;
}
