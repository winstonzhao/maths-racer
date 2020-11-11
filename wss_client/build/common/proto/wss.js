"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameResponse = exports.RegisterResponse = exports.Response = exports.ResponseType = exports.Type = void 0;
var Type;
(function (Type) {
    Type["REGISTER"] = "register";
    Type["REGISTER_RESPONSE"] = "register_response";
    Type["JOIN"] = "join_game";
    Type["UPDATE_GAME"] = "update_game";
    Type["LEAVE"] = "leave_game";
    Type["CREATE_GAME"] = "create_game";
    Type["CREATE_GAME_RESPONSE"] = "create_game_response";
})(Type = exports.Type || (exports.Type = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["SUCCESS"] = 0] = "SUCCESS";
    ResponseType[ResponseType["PLAYER_MISSING"] = 1] = "PLAYER_MISSING";
    ResponseType[ResponseType["GAME_MISSING"] = 2] = "GAME_MISSING";
    ResponseType[ResponseType["PLAYER_IN_GAME"] = 3] = "PLAYER_IN_GAME";
    ResponseType[ResponseType["PLAYER_NOT_IN_GAME"] = 4] = "PLAYER_NOT_IN_GAME";
    ResponseType[ResponseType["GAME_EXISTS"] = 5] = "GAME_EXISTS";
    ResponseType[ResponseType["GAME_FINISHED"] = 6] = "GAME_FINISHED";
    ResponseType[ResponseType["ANSWER_CORRECT"] = 7] = "ANSWER_CORRECT";
    ResponseType[ResponseType["ANSWER_INCORRECT"] = 8] = "ANSWER_INCORRECT";
    ResponseType[ResponseType["PLAYER_WON"] = 9] = "PLAYER_WON";
    ResponseType[ResponseType["NAME_TOO_SHORT"] = 10] = "NAME_TOO_SHORT";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
class Response {
    constructor(type, info) {
        this.type = type;
        this.info = info;
    }
}
exports.Response = Response;
class RegisterResponse {
    constructor(code, tag) {
        this.code = code;
        this.tag = tag;
        this.type = Type.REGISTER_RESPONSE;
    }
}
exports.RegisterResponse = RegisterResponse;
class CreateGameResponse {
    constructor(code, tag, gameId) {
        this.code = code;
        this.tag = tag;
        this.gameId = gameId;
        this.type = Type.CREATE_GAME_RESPONSE;
    }
}
exports.CreateGameResponse = CreateGameResponse;
