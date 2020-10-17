export enum Type {
  JOIN = "join_game",
}

export interface WssMessage {
  type: Type;
}

export interface JoinMesasge extends WssMessage {}
