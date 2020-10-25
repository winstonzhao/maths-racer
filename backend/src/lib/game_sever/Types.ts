export enum ResponseType {
  SUCCESS,
  PLAYER_MISSING,
  GAME_MISSING,
  PLAYER_IN_GAME,
  PLAYER_NOT_IN_GAME,
  GAME_EXISTS,
  GAME_FINISHED,
  ANSWER_CORRECT,
  ANSWER_INCORRECT,
  PLAYER_WON,
}

export class Response<T = any> {
  constructor(public type: ResponseType, public info?: T) {}
}

export class Player {
  constructor(public id: number, public name: string) {}
}

export class GameUpdate {
  constructor(public playerId: number, public answer: number) {}
}
