export enum Type {
  REGISTER = "register",
  REGISTER_RESPONSE = "register_response",
  JOIN = "join_game",
  UPDATE_GAME = "update_game",
  LEAVE = "leave_game",
}

export class Codes {
  static OK = 200;
}

export interface WssMessage {
  type: Type;
}

export interface GenericResponse {
  code: number;
}

export interface JoinMesasge extends WssMessage {}

export interface RegisterResponse extends GenericResponse {}
export interface RegisterRequest extends WssMessage {
  username: string;
}
