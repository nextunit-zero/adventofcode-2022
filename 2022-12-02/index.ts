import * as fs from 'fs';
import { join } from 'path';

enum GameOption {
    ROCK = 'rock',
    PAPER = 'paper',
    SCISSORS = 'scissors',
}

const winningMap: { [key: string]: GameOption[] } = {};
winningMap[GameOption.ROCK] = [GameOption.SCISSORS];
winningMap[GameOption.PAPER] = [GameOption.ROCK];
winningMap[GameOption.SCISSORS] = [GameOption.PAPER];

const score = {};
score[GameOption.ROCK] = 1;
score[GameOption.PAPER] = 2;
score[GameOption.SCISSORS] = 3;

class Translator {
    constructor(private translatorMap: { X: GameOption, Y: GameOption, Z: GameOption, }) { }

    public translate(input: string): GameOption {
        switch (input.trim()) {
            case 'A': return GameOption.ROCK;
            case 'B': return GameOption.PAPER;
            case 'C': return GameOption.SCISSORS;

            case 'X':
            case 'Y':
            case 'Z':
                return this.translatorMap[input.trim()];

            default: throw new Error('Unknown parameter ' + input.trim());
        }
    }
}

class Round {
    constructor(private enemyChoice: GameOption, private ownChoice: GameOption) { }

    public isDraw(): boolean {
        return this.enemyChoice === this.ownChoice;
    }

    public isWon(): boolean {
        if (this.isDraw()) {
            return false;
        }

        return winningMap[this.ownChoice].includes(this.enemyChoice);
    }

    public getScore(): number {
        return score[this.ownChoice] + (this.isWon() ? 6 : this.isDraw() ? 3 : 0);
    }
}

class Game {
    constructor(private translator: Translator, private rounds: Round[] = []) { }

    public getScore(): number {
        let score = 0;
        this.rounds.forEach((round) => score += round.getScore());
        return score;
    }

    public addRound(enemyMove: string, ownMove: string,) {
        this.rounds.push(new Round(this.translator.translate(enemyMove), this.translator.translate(ownMove)));
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

const game = new Game(new Translator({
    X: GameOption.ROCK,
    Y: GameOption.PAPER,
    Z: GameOption.SCISSORS,
}));

fileContentSplitByLines.forEach((line) => {
    const [enemyMove, ownMove] = line.split(' ');
    game.addRound(enemyMove, ownMove);
});

console.log('Answer 1: ' + game.getScore());