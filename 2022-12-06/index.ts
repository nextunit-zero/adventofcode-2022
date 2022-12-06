import * as fs from 'fs';
import { join } from 'path';

function getPositionOfFirstUniqueString(input: string, markerPosition = 4) {
    const substr = input.substring(markerPosition - 4, markerPosition).split('');
    const filteredDuplicates = substr.filter((item, index) => substr.indexOf(item) === index);
    if (filteredDuplicates.length === substr.length) {
        return markerPosition;
    }

    markerPosition++;
    if (markerPosition > input.length) {
        throw new Error('No position found');
    }

    return getPositionOfFirstUniqueString(input, markerPosition);
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
console.log('Answer 1:', getPositionOfFirstUniqueString(fileContent));