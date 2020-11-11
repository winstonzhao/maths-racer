"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationToString = exports.generateDisplayString = exports.generateQuestion = exports.getRandomOperation = exports.getRandomInt = void 0;
const model_1 = require("../model/model");
exports.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
exports.getRandomOperation = () => {
    const randomNumber = exports.getRandomInt(1, 4);
    switch (randomNumber) {
        case 1:
            return model_1.Operation.Plus;
        case 2:
            return model_1.Operation.Minus;
        case 3:
            return model_1.Operation.Multiply;
        case 4:
            return model_1.Operation.Divide;
    }
    throw Error(`Unknown random number for operation: ${randomNumber}`);
};
exports.generateQuestion = (operation, max, min = 1, max2 = max, min2 = 1) => {
    let firstNumber = exports.getRandomInt(min, max);
    let secondNumber = exports.getRandomInt(min2, max2);
    switch (operation) {
        case model_1.Operation.Plus:
            return new model_1.Equation(operation, firstNumber, secondNumber, firstNumber + secondNumber);
        case model_1.Operation.Minus:
            const tmpFirstNumber = Math.max(firstNumber, secondNumber);
            const tmpSecondNumber = Math.min(firstNumber, secondNumber);
            return new model_1.Equation(operation, tmpFirstNumber, tmpSecondNumber, tmpFirstNumber - tmpSecondNumber);
        case model_1.Operation.Multiply:
            return new model_1.Equation(operation, firstNumber, secondNumber, firstNumber * secondNumber);
        case model_1.Operation.Divide:
            secondNumber = [firstNumber, secondNumber][exports.getRandomInt(0, 1)];
            firstNumber = firstNumber * secondNumber;
            return new model_1.Equation(operation, firstNumber, secondNumber, firstNumber / secondNumber);
    }
};
exports.generateDisplayString = (firstNumber, secondNumber, operation) => {
    return `${firstNumber} ${exports.operationToString(operation)} ${secondNumber}`;
};
exports.operationToString = (operation) => {
    switch (operation) {
        case model_1.Operation.Plus:
            return "+";
        case model_1.Operation.Minus:
            return "-";
        case model_1.Operation.Multiply:
            return "*";
        case model_1.Operation.Divide:
            return "/";
    }
};
