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
        let currentRow = tree.getRow();
        while (currentRow > 0) {
            currentRow--;

            if (this.getTree(tree.getColumn(), currentRow).getSize() >= tree.getSize()) {
                return false;
            }
        }

        return true;
    }

    public isVisibleFromBottom(tree: Tree): boolean {
        let currentRow = tree.getRow();
        while (currentRow < this.maxRow) {
            currentRow++;

            if (this.getTree(tree.getColumn(), currentRow).getSize() >= tree.getSize()) {
                return false;
            }
        }

        return true;
    }

    public isVisibleFromLeft(tree: Tree): boolean {
        let currentColumn = tree.getColumn();
        while (currentColumn > 0) {
            currentColumn--;

            if (this.getTree(currentColumn, tree.getRow()).getSize() >= tree.getSize()) {
                return false;
            }
        }

        return true;
    }

    public isVisibleFromRight(tree: Tree): boolean {
        let currentColumn = tree.getColumn();
        while (currentColumn < this.maxColumn) {
            currentColumn++;

            if (this.getTree(currentColumn, tree.getRow()).getSize() >= tree.getSize()) {
                return false;
            }
        }

        return true;
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

    public static generateGrid(input: string): TreeGrid {
        const treeGrid = new TreeGrid();
        input.split("\n").forEach((line, rowIndex) => {
            line.trim().split('').forEach((size, columnIndex) => {
                treeGrid.addTree(new Tree(parseInt(size), columnIndex, rowIndex));
            });
        });

        return treeGrid;
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const grid = TreeGrid.generateGrid(fileContent);

console.log('Answer 1: :', grid.getVisibleTrees().length);