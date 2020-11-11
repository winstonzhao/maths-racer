export enum Type {
  REGISTER = "register",
  REGISTER_RESPONSE = "register_response",
  JOIN = "join_game",
  UPDATE_GAME = "update_game",
  LEAVE = "leave_game",
  CREATE_GAME = "create_game",
  CREATE_GAME_RESPONSE = "create_game_response",
}

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
  NAME_TOO_SHORT,
}

export class Response<T = any> {
  constructor(public type: ResponseType, public info?: T) {}
}

export interface WssMessage {
  type: Type;
  tag: number;
}

export interface GenericResponse extends WssMessage {
  code: number;
}

export interface JoinMesasge extends WssMessage {}

export class RegisterResponse implements GenericResponse {
  type: Type;

  constructor(public code: number, public tag: number) {
    this.type = Type.REGISTER_RESPONSE;
  }
}

export interface RegisterRequest extends WssMessage {
  username: string;
}

export interface CreateGameRequest extends WssMessage {}

export class CreateGameResponse implements GenericResponse {
  type: Type;

  constructor(public code: number, public tag: number, public gameId: number) {
    this.type = Type.CREATE_GAME_RESPONSE;
  }
}
