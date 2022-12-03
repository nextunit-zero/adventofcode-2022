import * as fs from 'fs';
import { join } from 'path';

class Rucksack {
    constructor(public compartment1: string, public compartment2: string) { }

    public getDuplicates(): string[] {
        const dupliactes = [];
        this.compartment1.split('').filter((char) => {
            if (this.compartment2.indexOf(char) !== -1 && !dupliactes.includes(char)) {
                dupliactes.push(char);
            }
        })

        return dupliactes;
    }

    public getPrioirotyMap(): { [key: string]: number } {
        const priorities = {}
        this.getDuplicates().forEach((char) => (priorities[char] = Rucksack.getProiority(char)));

        return priorities;
    }

    public static getProiority(char: string) {
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

    public static packRucksack(input: string): Rucksack {
        return new Rucksack(
            input.substring(0, (input.length / 2)),
            input.substring((input.length / 2)),
        );
    }
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
const fileContentSplitByLines = fileContent.split("\n");

const rucksacks = fileContentSplitByLines.map(Rucksack.packRucksack)

let sum = 0;
rucksacks.forEach((r, i) => {
    const map = r.getPrioirotyMap();
    console.log(`${i}: ${r.compartment1} || ${r.compartment2} ==> ${JSON.stringify(map)}`)

    Object.keys(map).forEach(k => sum += map[k]);
})

console.log('Answer 1: ' + sum);
