import { GameHandler } from "./GameManager";
import { GameUpdate, Player, Response, ResponseType } from "./Types";
import {
  Equation,
  generateQuestion,
  getRandomOperation,
  range,
} from "../common/lib";

export enum GameState {
  NOT_STARTED,
  PRE_START,
  IN_PROGRESS,
  PRE_END,
  END,
}

export interface GameListener {}

export class Game {
  NUM_QUESTIONS = 100;

  playersMap: { [playerId: number]: Player } = {};
  state = GameState.NOT_STARTED;
  startTime = 0;
  questions: Equation[] = range(100).map(() =>
    generateQuestion(getRandomOperation(), 100, 1, 100, 1)
  );
  playerQuestionIndex: { [playerId: number]: number } = {};

  constructor(public id: number, private handler: GameHandler) {}

  addPlayer(player: Player) {
    if (player.id in this.playersMap) {
      return false;
    }

    this.playerQuestionIndex[player.id] = 0;
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
    if (!(update.playerId in this.playerQuestionIndex)) {
      return new Response(ResponseType.PLAYER_NOT_IN_GAME);
    }

    const questionIndex = this.playerQuestionIndex[update.playerId];

    if (questionIndex >= this.questions.length) {
      return new Response(ResponseType.GAME_FINISHED);
    }

    const question = this.questions[questionIndex];

    if (update.answer === question.answer) {
      this.playerQuestionIndex[update.playerId]++;
      const newQuestionIndex = this.playerQuestionIndex[update.playerId];

      if (newQuestionIndex === this.questions.length) {
        this.state = GameState.PRE_END;
        return new Response(ResponseType.PLAYER_WON);
      }

      return new Response(
        ResponseType.ANSWER_CORRECT,
        this.questions[newQuestionIndex]
      );
    }

    return new Response(ResponseType.ANSWER_INCORRECT);
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
