import {generateRandomArrayWithoutDuplicates} from "../../utils/ArrayUtils";
import {getQuickSortMoves} from "./QuickSort";

test('It should sort arrays correctly with quick sort', () => {
    for (let i = 0; i < 1000; i++) {
        const array: number[] = generateRandomArrayWithoutDuplicates(Math.floor(Math.random() * 1000));
        let expected: number[] = [...array];
        expected = expected.sort((a: number, b: number) => a - b);
        const result = getQuickSortMoves(array);
        expect(result.sortedArray).toEqual(expected);
    }
});
