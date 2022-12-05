import * as fs from 'fs';
import { join } from 'path';

abstract class Ship {
    protected stacks: { [position: number]: string[] } = {};

    public add(position: number, crate: string) {
        if (!this.stacks[position]) {
            this.stacks[position] = [];
        }

        this.stacks[position].unshift(crate);
    }

    public getTopCrates(): string[] {
        return Object.keys(this.stacks).sort((n1, n2) => parseInt(n1) - parseInt(n2))
            .map((stackNo) => this.stacks[stackNo][this.stacks[stackNo].length - 1]);
    }

    public abstract move(crateCountToMove: number, fromStack: number, toStack: number): void;
}

class Ship9000 extends Ship {
    public move(crateCountToMove: number, fromStack: number, toStack: number) {
        for (let i = 0; i < crateCountToMove; i++) {
            this.stacks[toStack].push(this.stacks[fromStack].pop());
        }
    }
}

class Ship9001 extends Ship {
    public move(crateCountToMove: number, fromStack: number, toStack: number) {
        const crates = [];
        for (let i = 0; i < crateCountToMove; i++) {
            crates.push(this.stacks[fromStack].pop());
        }
        while (crates.length > 0) {
            this.stacks[toStack].push(crates.pop());
        }
    }
}

class Shiploader {
    private isMove = false;

    constructor(private ship: Ship) { }

    public loadShip(lines: string[]) {
        lines.forEach((line) => this.loadShipLine(line));
    }

    private loadShipLine(line: string) {
        if (line.trim() === '') {
            this.isMove = true;
            return;
        }
        if (this.isMove) {
            return this.doMoves(line);
        }
        return this.loadShipCrate(line);
    }

    private loadShipCrate(line: string) {
        let stackNo = 1;
        while (line.trim() !== '') {
            const crateContent = line.substring(0, 3);
            if (crateContent.trim() !== '' && crateContent.substring(0, 1) === '[' && crateContent.substring(2, 3) === ']') {
                this.ship.add(stackNo, crateContent.substring(1, 2));
            }
            line = line.substring(4);
            stackNo++;
        }
    }

    private doMoves(line: string) {
        const REARRANGE_REGEXP = /move (\d+) from (\d+) to (\d+)/g;

        const match = REARRANGE_REGEXP.exec(line.trim());
        if (!match) {
            console.log('WIRED ' + line);
        } else {
            this.ship.move(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
        }
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

const ship = new Ship9000();
const shipLoader = new Shiploader(ship);
shipLoader.loadShip(fileContentSplitByLines);

console.log('Answer 1:', ship.getTopCrates().join(''));

const ship2 = new Ship9001();
const shipLoader2 = new Shiploader(ship2);
shipLoader2.loadShip(fileContentSplitByLines);

console.log('Answer 2:', ship2.getTopCrates().join(''));