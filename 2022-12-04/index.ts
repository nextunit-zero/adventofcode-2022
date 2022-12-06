import * as fs from 'fs';
import { join } from 'path';

interface CleanupSection {
    start: number,
    end: number
}

function containsSection(sections: number[], containedSections: number[]): boolean {
    let containing = true;

    containedSections.forEach((containedSection) => {
        if (!containing) {
            return;
        }
        containing = sections.includes(containedSection);
    });

    return containing;
}
function hasOverlappingSections(sections: number[], containedSections: number[]): boolean {
    let containing = false;

    containedSections.forEach((containedSection) => {
        if (containing) {
            return;
        }
        containing = sections.includes(containedSection);
    });

    return containing;
}

class ElfCleanup {
    constructor(public start: number, public end: number) { }

    public contains(elf: ElfCleanup): boolean {
        return this.start <= elf.start && this.end >= elf.end;
    }

    public toString(): string {
        return `${this.start} - ${this.end}`;
    }

    public getContainedSections(): number[] {
        const numberArray = [];
        for (let i = this.start; i <= this.end; i++) {
            numberArray.push(i);
        }
        return numberArray;
    }
}

class CleanupPair {
    constructor(public first: ElfCleanup, public second: ElfCleanup) { }

    public getContainedSections(): number[] {
        const containedSections = this.first.getContainedSections().concat(this.second.getContainedSections());
        return containedSections.filter((item, index) => containedSections.indexOf(item) === index);
    }

    public containsExclusivelyDoubleCleaning(): boolean {
        if (containsSection(this.first.getContainedSections(), this.second.getContainedSections())) {
            return true;
        }
        if (containsSection(this.second.getContainedSections(), this.first.getContainedSections())) {
            return true;
        }

        return false;
    }

    public hasOverlaps(): boolean {
        return hasOverlappingSections(this.first.getContainedSections(), this.second.getContainedSections());
    } 
}

const pairs = [];

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

fileContentSplitByLines.forEach((line) => {
    const [firstElf, secondElf] = line.split(',');
    const [startFirstElf, endFirstElf] = firstElf.split('-');
    const [startSecondElf, endSecondElf] = secondElf.split('-');

    pairs.push(new CleanupPair(
        new ElfCleanup(parseInt(startFirstElf), parseInt(endFirstElf)),
        new ElfCleanup(parseInt(startSecondElf), parseInt(endSecondElf)),
    ))
});


let dupliactes = 0;
let overlaps = 0;
pairs.forEach((pair) => {
    if (pair.containsExclusivelyDoubleCleaning()) {
        dupliactes++;
    }
    if (pair.hasOverlaps()) {
        overlaps++;
    }
});

console.log('Answer 1: ' + dupliactes);
console.log('Answer 2: ' + overlaps);