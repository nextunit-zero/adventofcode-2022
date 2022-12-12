import * as fs from 'fs';
import { join } from 'path';

class Point {
    private visitedByTail = false;

    constructor(private xAxis: number = 0, private yAxis: number = 0) { }

    public getKey(): string {
        return `${this.xAxis}-${this.yAxis}`;
    }

    public getXAxis(): number {
        return this.xAxis;
    }

    public getYAxis(): number {
        return this.yAxis;
    }

    public next(direction: string): Point {
        let x = this.xAxis;
        let y = this.yAxis;
        switch (direction) {
            case 'R': x++; break;
            case 'L': x--; break;
            case 'U': y++; break;
            case 'D': y--; break;
        }

        return new Point(x, y);
    }

    public isTouching(p: Point): boolean {
        // Overlapping
        if (this.xAxis === p.getXAxis() && this.yAxis === p.getYAxis()) {
            return true;
        }
        // Horizontal
        if (this.yAxis === p.getYAxis() && Math.pow(this.xAxis - p.getXAxis(), 2) <= 1) {
            return true;
        }
        // Vertical
        if (this.xAxis === p.getXAxis() && Math.pow(this.yAxis - p.getYAxis(), 2) <= 1) {
            return true;
        }
        // Diagonal
        if (Math.pow(this.yAxis - p.getYAxis(), 2) <= 1 && Math.pow(this.xAxis - p.getXAxis(), 2) <= 1) {
            return true;
        }

        return false;
    }

    public tailTouched(): void {
        this.visitedByTail = true;
    }

    public isVisitedByTail(): boolean {
        return this.visitedByTail;
    }
}

class Grid {
    private start: Point;
    private head: Point;
    private tail: Point;
    private grid: { [key: string]: Point } = {};

    constructor() {
        this.start = new Point();
        this.head = this.start;
        this.tail = this.start;

        this.tail.tailTouched();
        this.grid[this.start.getKey()] = this.start;
    }

    public move(line: string): void {
        const regex = /([A-Z]) (\d+)/g
        const [_, direction, moves] = regex.exec(line);

        for (let i = 0; i < parseInt(moves); i++) {
            this.singleMove(direction);
        }
    }

    public getGrid(): { [key: string]: Point } {
        return this.grid;
    }

    public countPointsTailVisited(): number {
        const visitedList = Object.keys(this.grid).filter((key) => this.grid[key].isVisitedByTail());
        return visitedList.length;
    }

    private singleMove(direction: string): void {
        const next = this.head.next(direction);
        const oldPosition = this.head;

        if (!this.grid[next.getKey()]) {
            this.head = next;
        } else {
            this.head = this.grid[next.getKey()];
        }

        this.grid[this.head.getKey()] = this.head;
        if (!this.head.isTouching(this.tail)) {
            this.tail = oldPosition;
            this.tail.tailTouched();
        }
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

const grid = new Grid();
fileContentSplitByLines.forEach((line) => grid.move(line));
console.log('GRID', grid.getGrid());

console.log('Answer 1:', grid.countPointsTailVisited());