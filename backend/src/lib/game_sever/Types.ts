export class Player {
  constructor(public id: number, public name: string) {}
}

export class GameUpdate {
  constructor(public playerId: number, public answer: number) {}
}
