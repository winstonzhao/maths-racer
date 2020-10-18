export enum ResponseType {
  SUCCESS,
  PLAYER_MISSING,
  GAME_MISSING,
  PLAYER_IN_GAME,
  PLAYER_NOT_IN_GAME,
  GAME_EXISTS,
  GAME_FINISHED,
}

export class Response<T = any> {
  constructor(public type: ResponseType, public info?: T) {}
}

export class Player {
  constructor(public id: number, public name: string) {}
}

export class GameUpdate {
  constructor(public playerId: number) {}
}

export enum Operator {
  PLUS,
  MINUS,
  DIVIDE,
  MUTLIPLY,
}

export class Question {
  constructor(
    public firstNumber: number,
    public secondNumber: number,
    public operator: Operator,
    public answer: number
  ) {}
}
