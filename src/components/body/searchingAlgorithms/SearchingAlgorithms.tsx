import {Fragment, useEffect, useState} from "react";
import {Column} from "../../../api/Column";
import {generateRandomArrayWithoutDuplicates} from "../../../utils/ArrayUtils";
import Canvas, {resizeCanvasToContainerSize} from "../canvas/Canvas";
import {Box, Button, ButtonGroup} from "@mui/material";
import {getQuickSortMoves} from "../../../algorithms/sorting/QuickSort";
import {SearchMove, SearchResult} from "../../../api/SearchingApi";
import {getLinearSearchMoves} from "../../../algorithms/searching/LinearSearch";
import {Settings} from "../../../api/SettingsApi";
import {getBinarySearchMoves} from "../../../algorithms/searching/BinarySearch";
import {getInterpolationSearchMoves} from "../../../algorithms/searching/InterpolationSearch";
import {
    CANVAS_MARGIN_FACTOR_HIGH_SIZES,
    CANVAS_MARGIN_FACTOR_LOW_SIZES,
    DIAGONAL_FACTOR_HIGH_SIZES,
    DIAGONAL_FACTOR_LOW_SIZES,
    MARGIN_BETWEEN_ELEMENTS,
    MAX_RELATIVE_HEIGHT_HIGH_SIZES,
    MAX_RELATIVE_HEIGHT_LOW_SIZES
} from "../../../api/Constants";


const SearchingAlgorithms = (props: Settings) => {

    const [array, setArray] = useState<number[]>([]);
    const [value, setValue] = useState<number>(5);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    let columns: Column[] = [];
    let moves: SearchMove[] = [];

    useEffect(() => {
        if (canvasContext) {
            resetExample();
        }
        // Re-render component if screensize changes to adjust canvas
        window.addEventListener('resize', onGenerateNewArray);
        return () => {
            window.removeEventListener('resize', onGenerateNewArray);
        }
    }, [canvasContext]);

    const resetExample = (): void => {
        const newArray: number[] = generateRandomArrayWithoutDuplicates(props.arraySize);
        getQuickSortMoves(newArray);
        const newValue: number = newArray[Math.floor(Math.random() * newArray.length)];
        setArray(newArray);
        setValue(newValue);
    }

    function onGenerateNewArray() {
        if (canvasContext) {
            resetExample();
        }
    }

    function onLinearSearch() {
        if (moves.length > 0) return;
        const result: SearchResult = getLinearSearchMoves(array, value);
        moves = result.moves;
    }

    function onBinarySearch() {
        if (moves.length > 0) return;
        const result: SearchResult = getBinarySearchMoves(array, value);
        moves = result.moves;
    }

    function onInterpolationSearch() {
        if (moves.length > 0) return;
        const result: SearchResult = getInterpolationSearchMoves(array, value);
        moves = result.moves;
    }

    const draw = (context: CanvasRenderingContext2D): void => {
        setCanvasContext(context);
        if (!canvasContext) {
            return;
        }
        resizeCanvasToContainerSize(canvasContext.canvas);
        const diagonalFactor: number = array.length > 20 ? DIAGONAL_FACTOR_HIGH_SIZES : DIAGONAL_FACTOR_LOW_SIZES;
        const canvasMarginFactor: number = array.length > 8 ? CANVAS_MARGIN_FACTOR_HIGH_SIZES : CANVAS_MARGIN_FACTOR_LOW_SIZES;
        const canvasMargin: number = canvasContext.canvas.height * canvasMarginFactor * 0.5;
        const maxRelativeHeight: number = array.length > 8 ? MAX_RELATIVE_HEIGHT_HIGH_SIZES : MAX_RELATIVE_HEIGHT_LOW_SIZES;
        const spacing: number = (canvasContext.canvas.width - canvasMargin * 2) / array.length;
        for (let i = 0; i < array.length; i++) {
            const x: number = i * spacing + spacing / 2 + canvasMargin;
            const y: number = canvasContext.canvas.height - canvasMargin - i * diagonalFactor;
            const width: number = spacing - MARGIN_BETWEEN_ELEMENTS;
            const height: number = canvasContext.canvas.height * maxRelativeHeight * array[i];
            const isSearchValue: boolean = array[i] === value;
            columns[i] = new Column(x, y, width, height, isSearchValue);
        }
        animate();
    }

    function animate() {
        if (!canvasContext) {
            return;
        }
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        let changed = false;
        for (const col of columns) {
            changed = col.draw(canvasContext) || changed;
        }
        if (!changed && moves.length > 0) {
            const move: SearchMove | undefined = moves.shift();
            if (move) {
                columns[move.index].jumpSearch(move.isValue, props.frameCount);
            }
        }
        requestAnimationFrame(animate);
    }

    return (
        <Fragment>
            <Box
                width='50%'
                minWidth='350px'
                m={2}
                id='canvasContainer'>
                <Canvas draw={draw}/>
            </Box>
            <ButtonGroup
                variant='contained'
                sx={{m: 2}}>
                <Button onClick={onGenerateNewArray}>Generate new array</Button>
                <Button onClick={onLinearSearch}>Linear Search</Button>
                <Button onClick={onBinarySearch}>Binary Search</Button>
                <Button onClick={onInterpolationSearch}>Interpolation Search</Button>
            </ButtonGroup>
        </Fragment>
    );
};

export default SearchingAlgorithms;
