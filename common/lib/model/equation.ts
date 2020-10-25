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

export interface GameAnswer {
  playerId: number;
  correct: boolean;
  questionIdx: number;
}

export interface PlayerInfo {
  id: number;
  name: string;
}

export interface GameEndSummary {
  winnerId: number;
  scores: { [playerId: number]: number };
}

export const NUM_QUESTIONS = 100;
export const PRESTART_TIME_MILLIS = 5000;
export const GAME_DURATION_MILLIS = 60000;
