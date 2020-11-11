"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_DURATION_MILLIS = exports.PRESTART_TIME_MILLIS = exports.NUM_QUESTIONS = exports.Equation = exports.Operation = void 0;
var Operation;
(function (Operation) {
    Operation[Operation["Plus"] = 1] = "Plus";
    Operation[Operation["Minus"] = 2] = "Minus";
    Operation[Operation["Divide"] = 3] = "Divide";
    Operation[Operation["Multiply"] = 4] = "Multiply";
})(Operation = exports.Operation || (exports.Operation = {}));
class Equation {
    constructor(operation, firstNumber, secondNumber, answer) {
        this.operation = operation;
        this.firstNumber = firstNumber;
        this.secondNumber = secondNumber;
        this.answer = answer;
    }
}
exports.Equation = Equation;
exports.NUM_QUESTIONS = 100;
exports.PRESTART_TIME_MILLIS = 5000;
exports.GAME_DURATION_MILLIS = 60000;
