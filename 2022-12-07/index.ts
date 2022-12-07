import * as fs from 'fs';
import { join } from 'path';

interface File {
    fileName: string;
    fileSize: number;
}

class Directory {
    private files: File[] = [];
    private subdirectories: Directory[] = [];

    constructor(private name: string, private parentDir?: Directory) { }

    public addFile(file: File) {
        this.files.push(file);
    }

    public addSubDirectory(dir: Directory) {
        this.subdirectories.push(dir);
    }

    public getName(): string {
        return this.name;
    }

    public getParentDirectory(): Directory {
        return this.parentDir;
    }

    public getSubDirectory(name: string): Directory {
        return this.subdirectories.find((d) => d.name === name);
    }

    public getSubDirectories(): Directory[] {
        return this.subdirectories;
    }

    public getStructure() {
        return {
            name: this.name,
            subdirectory: this.subdirectories.map((dir) => dir.getStructure()),
            files: this.files,
        };
    }

    public getTotalSize(): number {
        let size = 0;
        this.files.forEach((f) => size += f.fileSize);
        this.subdirectories.forEach((dir) => size += dir.getTotalSize());

        return size;
    }
}

class Terminal {
    public readonly rootDir = new Directory('');
    private currentDir;
    private currentCommand: (line: string) => void;

    constructor() {
        this.currentDir = this.rootDir;
    }

    public input(line: string) {
        this.currentCommand(line);
    }

    public execute(line: string) {
        const split = line.split(' ');
        const command = split.shift();
        const content = split.join(' ');

        switch (command) {
            case 'cd': {
                this.currentDir = this.getDirectory(content);

                break;
            }
            case 'ls': {
                this.currentCommand = this.lsInput;
                break;
            }
        }
    }

    public getStructure() {
        return this.rootDir.getStructure();
    }

    public walkThrough<T>(fn: (dir: Directory) => T, currentDir: Directory = this.rootDir): T[] {
        let array: T[] = [];
        array.push(fn(currentDir));

        currentDir.getSubDirectories().forEach((dir) => array = array.concat(this.walkThrough(fn, dir)));

        return array;
    }

    public getDirectory(path: string): Directory {
        if (path.startsWith('/')) {
            let currentDir = this.rootDir;
            const pathParts = path.substring(1).split('/');
            // Remove the first part, because it is already taken into account with setting it 

            pathParts.forEach((p) => {
                if (p.trim() === '') {
                    return;
                }
                currentDir = currentDir.getSubDirectory(p.trim());
            });

            return currentDir;
        } else if (path === '..') {
            return this.currentDir.getParentDirectory();
        } else {
            return this.currentDir.getSubDirectory(path.trim());
        }
    }

    private lsInput(line: string) {
        if (line.startsWith('dir')) {
            const [_, dir] = line.split(' ');
            this.currentDir.addSubDirectory(new Directory(dir, this.currentDir));
        } else {
            const [size, fileName] = line.split(' ');
            this.currentDir.addFile({
                fileName,
                fileSize: parseInt(size),
            })
        }
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

const terminal = new Terminal();

fileContentSplitByLines.forEach((line) => {
    if (line.startsWith("$")) {
        terminal.execute(line.substring(1).trim());
    } else {
        terminal.input(line);
    }
})

let sum = 0;
terminal.walkThrough((dir) => {
    if (dir.getTotalSize() <= 100000) {
        sum += dir.getTotalSize();
    }
});

console.log('Answer 1:', sum);