import {getBubbleSortMoves} from "./BubbleSort";
import {generateRandomArrayWithoutDuplicates} from "../../utils/ArrayUtils";

test('It should sort array correctly with bubble sort', () => {
    for (let i = 0; i < 1000; i++) {
        const array: number[] = generateRandomArrayWithoutDuplicates(Math.floor(Math.random() * 1000));
        let expected: number[] = [...array];
        expected = expected.sort((a: number, b: number) => a - b);
        const result = getBubbleSortMoves(array);
        expect(result.sortedArray).toEqual(expected);
    }
});
