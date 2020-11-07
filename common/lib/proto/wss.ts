export enum Type {
  JOIN = "join_game",
  UPDATE_GAME = "update_game",
  LEAVE = "leave_game",
}

export interface WssMessage {
  type: Type;
}

export interface JoinMesasge extends WssMessage {}
