import { Game } from "./Game";
import { GameUpdate, Player, Response, ResponseType } from "./Types";

export interface GameHandler {}

export class GameManager implements GameHandler {
  games: { [id: number]: Game } = {};
  gamesByPlayer: { [id: number]: Game } = {};
  players: { [id: number]: Player } = {};
  playerFactory = new PlayerFactory();
  gameFactory = new GameFactory();

  addPlayer(name: string) {
    const player = this.playerFactory.createPlayer(name);
    this.players[player.id] = player;
    return new Response(ResponseType.SUCCESS, player);
  }

  removePlayer(id: number): Response {
    if (id in this.players) {
      delete this.players[id];
    } else {
      return new Response(ResponseType.PLAYER_MISSING);
    }

    if (id in this.gamesByPlayer) {
      delete this.gamesByPlayer[id];
    }

    return new Response(ResponseType.SUCCESS);
  }

  createGame(playerId: number): Response {
    if (!(playerId in this.players)) {
      return new Response(ResponseType.PLAYER_MISSING);
    }

    if (playerId in this.gamesByPlayer) {
      return new Response(ResponseType.PLAYER_IN_GAME);
    }

    const game = this.gameFactory.createGame(this);
    this.games[game.id] = game;
    this.joinGame(playerId, game.id);

    return new Response(ResponseType.SUCCESS, game);
  }

  joinGame(playerId: number, gameId: number): Response {
    if (!(playerId in this.players)) {
      return new Response(ResponseType.PLAYER_MISSING);
    }

    if (playerId in this.gamesByPlayer) {
      return new Response(ResponseType.PLAYER_IN_GAME);
    }

    if (!(gameId in this.games)) {
      return new Response(ResponseType.GAME_MISSING);
    }

    this.games[gameId].addPlayer(this.players[playerId]);
    this.gamesByPlayer[playerId] = this.games[gameId];

    if (this.games[gameId].getPlayerCount() >= 2) {
      this.games[gameId].finish();
    }

    return new Response(ResponseType.SUCCESS);
  }

  leaveGame(playerId: number, gameId: number): Response {
    if (!(playerId in this.players)) {
      return new Response(ResponseType.PLAYER_MISSING);
    }

    if (!(playerId in this.gamesByPlayer)) {
      return new Response(ResponseType.PLAYER_IN_GAME);
    }

    if (!(gameId in this.games)) {
      return new Response(ResponseType.GAME_MISSING);
    }

    this.games[gameId].removePlayer(playerId);
    delete this.gamesByPlayer[playerId];
    if (this.games[gameId].getPlayerCount() == 0) {
      this.games[gameId].start();
    }

    return new Response(ResponseType.SUCCESS);
  }

  updateGame(gameId: number, update: GameUpdate): Response {
    if (!(gameId in this.games)) {
      return new Response(ResponseType.GAME_MISSING);
    }

    if (!(update.playerId in this.players)) {
      return new Response(ResponseType.PLAYER_MISSING);
    }

    if (this.games[gameId].isFinished()) {
      return new Response(ResponseType.GAME_FINISHED);
    }

    return this.games[gameId].updateGame(update);
  }
}

export class PlayerFactory {
  idCounter = 0;

  createPlayer(name: string) {
    return new Player(++this.idCounter, name);
  }
}

export class GameFactory {
  idCounter = 0;

  createGame(handler: GameHandler) {
    return new Game(++this.idCounter, handler);
  }
}
