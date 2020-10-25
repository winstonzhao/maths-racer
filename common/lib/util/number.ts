import { Equation, Operation } from "../model/model";

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomOperation = () => {
  const randomNumber = getRandomInt(1, 4);
  switch (randomNumber) {
    case 1:
      return Operation.Plus;
    case 2:
      return Operation.Minus;
    case 3:
      return Operation.Multiply;
    case 4:
      return Operation.Divide;
  }
  throw Error(`Unknown random number for operation: ${randomNumber}`);
};

export const generateQuestion = (
  operation: Operation,
  max: number,
  min = 1,
  max2 = max,
  min2 = 1
): Equation => {
  let firstNumber = getRandomInt(min, max);
  let secondNumber = getRandomInt(min2, max2);
  switch (operation) {
    case Operation.Plus:
      return new Equation(
        operation,
        firstNumber,
        secondNumber,
        firstNumber + secondNumber
      );
    case Operation.Minus:
      const tmpFirstNumber = Math.max(firstNumber, secondNumber);
      const tmpSecondNumber = Math.min(firstNumber, secondNumber);
      return new Equation(
        operation,
        tmpFirstNumber,
        tmpSecondNumber,
        tmpFirstNumber - tmpSecondNumber
      );
    case Operation.Multiply:
      return new Equation(
        operation,
        firstNumber,
        secondNumber,
        firstNumber * secondNumber
      );
    case Operation.Divide:
      secondNumber = [firstNumber, secondNumber][getRandomInt(0, 1)];
      firstNumber = firstNumber * secondNumber;
      return new Equation(
        operation,
        firstNumber,
        secondNumber,
        firstNumber / secondNumber
      );
  }
};

export const generateDisplayString = (
  firstNumber: number,
  secondNumber: number,
  operation: Operation
) => {
  return `${firstNumber} ${operationToString(operation)} ${secondNumber}`;
};

export const operationToString = (operation: Operation) => {
  switch (operation) {
    case Operation.Plus:
      return "+";
    case Operation.Minus:
      return "-";
    case Operation.Multiply:
      return "*";
    case Operation.Divide:
      return "/";
  }
};
