import { GameHandler } from "./GameManager";
import { GameUpdate, Player, Response, ResponseType } from "./Types";
import {
  Equation,
  GameAnswer,
  GameEndSummary,
  GAME_DURATION_MILLIS,
  generateQuestion,
  getRandomOperation,
  NUM_QUESTIONS,
  PlayerInfo,
  PRESTART_TIME_MILLIS,
  range,
} from "../common/lib";

export enum GameState {
  NOT_STARTED,
  PRE_START,
  IN_PROGRESS,
  END,
}

export interface GameListener {
  onGamePrestart: (startTime: number) => void;
  onGameStart: () => void;
  onAnswer: (answer: GameAnswer) => void;
  onAddPlayer: (info: PlayerInfo) => void;
  onRemovePlayer: (id: number) => void;
  onGameEnd: (summary: GameEndSummary) => void;
}

export class Game {
  listeners: GameListener[] = [];
  playersMap: { [playerId: number]: Player } = {};
  state = GameState.NOT_STARTED;
  startTime = 0;
  questions: Equation[] = range(NUM_QUESTIONS).map(() =>
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

    this.tellAllListeners((l) => l.onAddPlayer(player));

    return true;
  }

  removePlayer(playerId: number) {
    if (playerId in this.playersMap) {
      delete this.playersMap[playerId];
      return true;
    }

    this.tellAllListeners((l) => l.onRemovePlayer(playerId));

    return false;
  }

  updateGame(update: GameUpdate): Response {
    if (!(update.playerId in this.playerQuestionIndex)) {
      return new Response(ResponseType.PLAYER_NOT_IN_GAME);
    }

    const questionIndex = this.playerQuestionIndex[update.playerId];

    if (questionIndex >= this.questions.length || this.state == GameState.END) {
      return new Response(ResponseType.GAME_FINISHED);
    }

    const question = this.questions[questionIndex];

    if (update.answer === question.answer) {
      this.playerQuestionIndex[update.playerId]++;
      const newQuestionIndex = this.playerQuestionIndex[update.playerId];

      if (newQuestionIndex === this.questions.length) {
        this.state = GameState.END;

        this.tellAllListeners((l) =>
          l.onGameEnd({
            winnerIds: [update.playerId],
            scores: this.playerQuestionIndex,
          })
        );

        return new Response(ResponseType.PLAYER_WON);
      }

      this.tellAllListeners((l) =>
        l.onAnswer({
          playerId: update.playerId,
          correct: true,
          questionIdx: newQuestionIndex,
        })
      );

      return new Response(
        ResponseType.ANSWER_CORRECT,
        this.questions[newQuestionIndex]
      );
    }

    this.tellAllListeners((l) =>
      l.onAnswer({
        playerId: update.playerId,
        correct: false,
        questionIdx: questionIndex,
      })
    );

    return new Response(ResponseType.ANSWER_INCORRECT);
  }

  getPlayerCount() {
    return Object.keys(this.playersMap).length;
  }

  isFinished() {
    return this.state === GameState.END;
  }

  start() {
    this.state = GameState.PRE_START;
    this.startTime = new Date().valueOf();
    this.tellAllListeners((l) => l.onGamePrestart(this.startTime));

    setTimeout(
      () => (this.state = GameState.IN_PROGRESS),
      PRESTART_TIME_MILLIS
    );

    setTimeout(() => this.finish(), GAME_DURATION_MILLIS);
  }

  finish() {
    const max = Math.max(...Object.values(this.playerQuestionIndex));
    const winnerIds: number[] = [];
    const keys = (Object.keys(this.playerQuestionIndex) as unknown) as number[];

    keys.forEach((key) => {
      if (this.playerQuestionIndex[key] === max) {
        winnerIds.push(key);
      }
    });

    this.tellAllListeners((l) =>
      l.onGameEnd({ winnerIds, scores: this.playerQuestionIndex })
    );
  }

  tellAllListeners(ev: (listener: GameListener) => void) {
    this.listeners.forEach(ev);
  }
}
