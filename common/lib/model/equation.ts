export enum Operation {
  Plus = 1,
  Minus,
  Divide,
  Multiply,
}

export class Equation {
  constructor(
    public operation: Operation,
    public firstNumber: number,
    public secondNumber: number,
    public answer: number
  ) {}
}
