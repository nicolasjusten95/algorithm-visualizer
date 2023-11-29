import {Column} from "../api/Column";
import {
    CANVAS_MARGIN_FACTOR_HIGH_SIZES,
    CANVAS_MARGIN_FACTOR_LOW_SIZES,
    DIAGONAL_FACTOR_HIGH_SIZES,
    DIAGONAL_FACTOR_LOW_SIZES, MARGIN_BETWEEN_ELEMENTS, MAX_RELATIVE_HEIGHT_HIGH_SIZES, MAX_RELATIVE_HEIGHT_LOW_SIZES
} from "../api/Constants";

export function calculateColumns(newArray: number[], newValue: number, canvasContext: CanvasRenderingContext2D): Column[] {
    const newColumns: Column[] = [];
    const diagonalFactor: number = newArray.length > 20 ? DIAGONAL_FACTOR_HIGH_SIZES : DIAGONAL_FACTOR_LOW_SIZES;
    const canvasMarginFactor: number = newArray.length > 8 ? CANVAS_MARGIN_FACTOR_HIGH_SIZES : CANVAS_MARGIN_FACTOR_LOW_SIZES;
    const canvasMargin: number = canvasContext.canvas.height * canvasMarginFactor * 0.5;
    const maxRelativeHeight: number = newArray.length > 8 ? MAX_RELATIVE_HEIGHT_HIGH_SIZES : MAX_RELATIVE_HEIGHT_LOW_SIZES;
    const spacing: number = (canvasContext.canvas.width - canvasMargin * 2) / newArray.length;
    for (let i = 0; i < newArray.length; i++) {
        const x: number = i * spacing + spacing / 2 + canvasMargin;
        const y: number = canvasContext.canvas.height - canvasMargin - i * diagonalFactor;
        const width: number = spacing - MARGIN_BETWEEN_ELEMENTS;
        const height: number = canvasContext.canvas.height * maxRelativeHeight * newArray[i];
        const isSearchValue: boolean = newArray[i] === newValue;
        newColumns[i] = new Column(x, y, width, height, isSearchValue);
    }
    return newColumns;
}