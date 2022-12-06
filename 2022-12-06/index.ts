import * as fs from 'fs';
import { join } from 'path';

function getPositionOfFirstUniqueString(input: string, uniqueStringSize: number, markerPosition = -1) {
    if (markerPosition === -1) {
        markerPosition = uniqueStringSize;
    }

    const substr = input.substring(markerPosition - uniqueStringSize, markerPosition).split('');
    const filteredDuplicates = substr.filter((item, index) => substr.indexOf(item) === index);
    if (filteredDuplicates.length === substr.length) {
        return markerPosition;
    }

    markerPosition++;
    if (markerPosition > input.length) {
        throw new Error('No position found');
    }

    return getPositionOfFirstUniqueString(input, uniqueStringSize, markerPosition);
}

const fileContent = fs.readFileSync(join(__dirname, './input.txt')).toString();
console.log('Answer 1:', getPositionOfFirstUniqueString(fileContent, 4));
console.log('Answer 2:', getPositionOfFirstUniqueString(fileContent, 14));