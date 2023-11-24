export interface Move {
    indices: number[];
    swap: boolean;
}

export interface SortingResult {
    sortedArray: number[];
    moves: Move[];
}