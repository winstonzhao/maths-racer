import { GameHandler } from "./GameManager";
import { GameUpdate, Player, Question, Response, ResponseType } from "./Types";
import { getRandomOperation } from "common/lib/lib";

export enum GameState {
  NOT_STARTED,
  PRE_START,
  IN_PROGRESS,
  PRE_END,
  END,
}

export interface GameListener {}

export class Game {
  NUM_QUESTIONS = 20;

  playersMap: { [playerId: number]: Player } = {};
  state = GameState.NOT_STARTED;
  startTime = 0;
  questions: Question[];

  constructor(public id: number, private handler: GameHandler) {
    this.questions = [];
    getRandomOperation();
  }

  addPlayer(player: Player) {
    if (player.id in this.playersMap) {
      return false;
    }
    this.playersMap[player.id] = player;
    return true;
  }

  removePlayer(playerId: number) {
    if (playerId in this.playersMap) {
      delete this.playersMap[playerId];
      return true;
    }

    return false;
  }

  updateGame(update: GameUpdate): Response {
    return new Response(ResponseType.SUCCESS);
  }

  getPlayerCount() {
    return Object.keys(this.playersMap).length;
  }

  isFinished() {
    return true;
  }

  start() {
    this.state = GameState.PRE_START;
    this.startTime = new Date().valueOf();
    setTimeout(() => {
      this.state = GameState.IN_PROGRESS;
    }, 5000);
  }

  finish() {}
}
