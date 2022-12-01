import * as fs from 'fs';
import { join } from 'path';

class Elf {
    constructor(private calories: number[]) { }

    public getCaloriesSum() {
        let calories = 0;
        this.calories.forEach((c) => calories += c);

        return calories;
    }
}

class ElfList {
    constructor(private elfs: Elf[]) { }

    public getMaxElf() {
        const elf = this.elfs.reduce((prev, current) => prev.getCaloriesSum() > current.getCaloriesSum() ? prev : current);
        return {
            position: this.elfs.indexOf(elf),
            elf,
            calories: elf.getCaloriesSum(),
        }
    }

    public remove(elf: Elf) {
        this.elfs = this.elfs.filter((e) => e !== elf);
    }

    public removeMaxElf() {
        this.remove(this.getMaxElf().elf);
    }

    public print() {
        let number = 0;
        this.elfs.forEach((elf) => {
            console.log(number + ":\t" + elf.getCaloriesSum());
            number++;
        });
    }

    public static getList(lines: string[]): ElfList {
        let elfs = [];
        let calories = [];

        lines.forEach((line) => {
            if (line.trim() === '') {
                elfs.push(new Elf(calories));
                calories = [];
            } else {
                calories.push(parseInt(line));
            }
        });

        if (calories.length > 0) {
            elfs.push(new Elf(calories));
        }

        return new ElfList(elfs);
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

// Part 1
const elfList = ElfList.getList(fileContentSplitByLines);
console.log(`Answer part 1: ${elfList.getMaxElf().calories}`);

// Add up the first 3
let completeCalories = elfList.getMaxElf().calories;

elfList.removeMaxElf();
completeCalories += elfList.getMaxElf().calories;
elfList.removeMaxElf();
completeCalories += elfList.getMaxElf().calories;

console.log("Answer part 2: " + completeCalories);