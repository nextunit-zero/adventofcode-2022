import * as fs from 'fs';
import { join } from 'path';

class Tree {
    constructor(private size: number, private column: number, private row: number) { }

    public getColumn(): number {
        return this.column;
    }

    public getRow(): number {
        return this.row;
    }

    public getSize(): number {
        return this.size;
    }
}


class TreeGrid {
    private treeGrid: Tree[][] = [];
    private maxRow: number = 0;
    private maxColumn: number = 0;

    public addTree(tree: Tree) {
        if (!this.treeGrid[tree.getColumn()]) {
            this.treeGrid[tree.getColumn()] = [];
        }
        this.treeGrid[tree.getColumn()][tree.getRow()] = tree;
        if (tree.getColumn() > this.maxColumn) {
            this.maxColumn = tree.getColumn();
        }
        if (tree.getRow() > this.maxRow) {
            this.maxRow = tree.getRow();
        }
    }

    public isVisibleFromTop(tree: Tree): boolean {
        return this.getViewFromTop(tree).visible;
    }

    public getViewCountToTop(tree: Tree): number {
        return this.getViewFromTop(tree).view
    }

    public isVisibleFromBottom(tree): boolean {
        return this.getViewFromBottom(tree).visible;
    }

    public getViewCountToBottom(tree: Tree): number {
        return this.getViewFromBottom(tree).view;
    }

    public isVisibleFromLeft(tree: Tree): boolean {
        return this.getViewFromLeft(tree).visible;
    }

    public getViewCountToLeft(tree: Tree): number {
        return this.getViewFromLeft(tree).view;
    }

    public isVisibleFromRight(tree: Tree): boolean {
        return this.getViewFromRight(tree).visible;
    }

    public getViewCountToRight(tree: Tree): number {
        return this.getViewFromRight(tree).view;
    }

    public isVisible(tree: Tree) {
        return this.isVisibleFromBottom(tree) || this.isVisibleFromLeft(tree) || this.isVisibleFromRight(tree) || this.isVisibleFromTop(tree);
    }

    public getVisibility(tree: Tree) {
        return {
            bottom: this.isVisibleFromBottom(tree),
            left: this.isVisibleFromLeft(tree),
            right: this.isVisibleFromRight(tree),
            top: this.isVisibleFromTop(tree),
        }
    }

    public getTree(column: number, row: number): Tree {
        return this.treeGrid[column][row];
    }

    public getTreeList(filter: (tree: Tree) => boolean = () => true): Tree[] {
        const treeList = [];
        for (let column = 0; column <= this.maxColumn; column++) {
            for (let row = 0; row <= this.maxRow; row++) {
                const tree = this.getTree(column, row);
                if (filter(tree)) {
                    treeList.push(tree);
                }
            }
        }
        return treeList;
    }

    public getVisibleTrees(): Tree[] {
        return this.getTreeList((tree: Tree) => this.isVisible(tree));
    }

    public getScenicScore(tree: Tree): number {
        return this.getViewCountToBottom(tree) * this.getViewCountToLeft(tree) * this.getViewCountToRight(tree) * this.getViewCountToTop(tree);
    }

    public static generateGrid(input: string): TreeGrid {
        const treeGrid = new TreeGrid();
        input.split("\n").forEach((line, rowIndex) => {
            line.trim().split('').forEach((size, columnIndex) => {
                treeGrid.addTree(new Tree(parseInt(size), columnIndex, rowIndex));
            });
        });

        return treeGrid;
    }

    private getViewFromTop(tree: Tree): { view: number, visible: boolean } {
        let currentRow = tree.getRow();
        let count = 0;
        while (currentRow > 0) {
            currentRow--;
            count++;

            if (this.getTree(tree.getColumn(), currentRow).getSize() >= tree.getSize()) {
                return { view: count, visible: false };
            }
        }

        return { view: count, visible: true };
    }

    private getViewFromBottom(tree: Tree): { view: number, visible: boolean } {
        let currentRow = tree.getRow();
        let count = 0;
        while (currentRow < this.maxRow) {
            currentRow++;
            count++;

            if (this.getTree(tree.getColumn(), currentRow).getSize() >= tree.getSize()) {
                return { view: count, visible: false };
            }
        }
        return { view: count, visible: true };
    }

    private getViewFromLeft(tree: Tree): { view: number, visible: boolean } {
        let currentColumn = tree.getColumn();
        let count = 0;
        while (currentColumn > 0) {
            currentColumn--;
            count++;

            if (this.getTree(currentColumn, tree.getRow()).getSize() >= tree.getSize()) {
                return { view: count, visible: false };
            }
        }

        return { view: count, visible: true };
    }

    private getViewFromRight(tree: Tree): { view: number, visible: boolean } {
        let currentColumn = tree.getColumn();
        let count = 0;
        while (currentColumn < this.maxColumn) {
            currentColumn++;
            count++;

            if (this.getTree(currentColumn, tree.getRow()).getSize() >= tree.getSize()) {
                return { view: count, visible: false };
            }
        }

        return { view: count, visible: true };
    }

}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const grid = TreeGrid.generateGrid(fileContent);

console.log('Answer 1: :', grid.getVisibleTrees().length);

let max = 0;
grid.getTreeList().forEach((tree) => max = grid.getScenicScore(tree) > max ? grid.getScenicScore(tree) : max);

console.log('Answer 2: :', max);