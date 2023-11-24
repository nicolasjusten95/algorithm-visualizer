export interface Move {
    indices: number[];
    swap: boolean;
}

export interface SortingResult {
    sortedArray: number[];
    moves: Move[];
}

export interface QueueItem {
    x: number;
    y: number;
    swap: boolean;
}
