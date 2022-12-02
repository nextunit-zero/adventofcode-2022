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

    public revertTranslate(input: GameOption): string {
        switch (input) {
            case GameOption.ROCK: return 'A';
            case GameOption.PAPER: return 'B';
            case GameOption.SCISSORS: return 'C';

            default: throw new Error('Unknown parameter ' + input);
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

    public addRound(enemyMove: string, ownMove: string) {
        this.rounds.push(new Round(this.translator.translate(enemyMove), this.translator.translate(ownMove)));
    }

    public getTranslator(): Translator {
        return this.getTranslator();
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

const translator = new Translator({
    // Should fail
    X: undefined,
    Y: undefined,
    Z: undefined,
});
const game2 = new Game(translator);
fileContentSplitByLines.forEach((line) => {
    const [enemyMove, matchResult] = line.split(' ');
    let ownMove: string;

    switch (matchResult.trim()) {
        case 'X': ownMove = translator.revertTranslate(winningMap[translator.translate(enemyMove.trim())][0]); break;
        case 'Y': ownMove = enemyMove.trim(); break; //DRAW 
        case 'Z': ownMove = translator.revertTranslate(Object.keys(winningMap).find((key) => winningMap[key].includes(translator.translate(enemyMove.trim()))) as GameOption); break;
    }

    game2.addRound(enemyMove, ownMove);
});
console.log('Answer 2: ' + game2.getScore());


