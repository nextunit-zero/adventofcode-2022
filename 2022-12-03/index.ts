import * as fs from 'fs';
import { join } from 'path';

function getDuplicates(a: string, b: string): string[] {
    const dupliactes = [];
    a.split('').filter((char) => {
        if (b.indexOf(char) !== -1 && !dupliactes.includes(char)) {
            dupliactes.push(char);
        }
    })

    return dupliactes;
}

function getProiority(char: string) {
    const code = char.charCodeAt(0);
    // Upper case letters in Ascii
    if (code >= 65 && code <= 90) {
        // First remove the Ascii overhead and bring A -> 0, them add the 27 for priority
        return code - 65 + 27;
    }
    // Lower case letters in Ascii
    if (code >= 97 && code <= 122) {
        // First remove the Ascii overhead and bring a -> 0, them add the 1 for priority
        return code - 97 + 1;
    }
}

class Rucksack {
    constructor(public compartment1: string, public compartment2: string) { }

    public getDuplicates(): string[] {
        return getDuplicates(this.compartment1, this.compartment2);
    }

    public getPrioirotyMap(): { [key: string]: number } {
        const priorities = {}
        this.getDuplicates().forEach((char) => (priorities[char] = getProiority(char)));

        return priorities;
    }

    public getItems(): string {
        return this.compartment1 + this.compartment2;
    }

    public static packRucksack(input: string): Rucksack {
        return new Rucksack(
            input.substring(0, (input.length / 2)),
            input.substring((input.length / 2)),
        );
    }
}

class Group {
    private elfs: Rucksack[] = [];

    public add(elf: Rucksack) {
        if (this.elfs.length >= 3) {
            throw new Error('Group already full');
        }

        this.elfs.push(elf);
    }

    public getBadges(): string[] {
        if (this.elfs.length < 2) {
            throw new Error('Too less elfs to compare')
        }
        let duplicates = this.elfs[0].getItems().split('');

        this.elfs.forEach((elf) => {
            duplicates = getDuplicates(duplicates.join(''), elf.getItems());
        });

        return duplicates;
    }

    public getBadge(): string {
        const badges = this.getBadges();
        if (badges.length !== 1) {
            throw new Error('There are multiple badges available')
        }

        return badges[0];
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

const rucksacks = fileContentSplitByLines.map(Rucksack.packRucksack)

const groups = [];

let sum = 0;
rucksacks.forEach((r, i) => {
    const map = r.getPrioirotyMap();
    console.log(`${i}: ${r.compartment1} || ${r.compartment2} ==> ${JSON.stringify(map)}`)

    Object.keys(map).forEach(k => sum += map[k]);

    if (i % 3 === 0) {
        groups.push(new Group());
    }

    groups[groups.length - 1].add(r);
})

console.log('Answer 1: ' + sum);

let sumBadges = 0;
groups.forEach((g) => sumBadges += (getProiority(g.getBadge())))

console.log('Answer 2: ' + sumBadges);