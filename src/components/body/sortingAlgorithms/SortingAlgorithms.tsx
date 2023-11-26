import Canvas, {resizeCanvasToContainerSize} from "../canvas/Canvas";
import {Move, SortingResult} from "../../../api/SortingApi";
import {Column} from "../../../api/Column";
import {getMergeSortMoves} from "../../../algorithms/sorting/MergeSort";
import {getQuickSortMoves} from "../../../algorithms/sorting/QuickSort";
import {getBubbleSortMoves} from "../../../algorithms/sorting/BubbleSort";
import {generateRandomArrayWithoutDuplicates} from "../../../utils/ArrayUtils";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, ButtonGroup} from "@mui/material";


interface SortingAlgorithmsProps {
    arraySize: number;
    frameCount: number;
}

const MAX_RELATIVE_HEIGHT_LOW_SIZES: number = 0.5;
const MAX_RELATIVE_HEIGHT_HIGH_SIZES: number = 0.8;
const DIAGONAL_FACTOR_LOW_SIZES: number = 1;
const DIAGONAL_FACTOR_HIGH_SIZES: number = 0.5;
const CANVAS_MARGIN_FACTOR_HIGH_SIZES: number = 0.2;
const CANVAS_MARGIN_FACTOR_LOW_SIZES: number = 0.4;
const MARGIN_BETWEEN_ELEMENTS: number = 4;

const SortingAlgorithms = (props: SortingAlgorithmsProps) => {

    const [array, setArray] = useState<number[]>([]);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

    const columns: Column[] = [];
    let moves: Move[] = [];

    useEffect(() => {
        resetArray();
        // Re-render component if screensize changes to adjust canvas
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    function handleResize() {
        resetArray();
    }

    const resetArray = (): void => {
        const newArray: number[] = generateRandomArrayWithoutDuplicates(props.arraySize);
        setArray(newArray);
    }

    function onGenerateNewArray() {
        resetArray();
    }

    function onBubbleSort() {
        if (moves.length > 0) {
            return;
        }
        const result: SortingResult = getBubbleSortMoves(array);
        moves = result.moves;
    }

    function onQuickSort() {
        if (moves.length > 0) {
            return;
        }
        const result: SortingResult = getQuickSortMoves(array);
        moves = result.moves;
    }

    function onMergeSort() {
        if (moves.length > 0) {
            return;
        }
        const result: SortingResult = getMergeSortMoves(array);
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
            columns[i] = new Column(x, y, width, height);
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
            const move: Move | undefined = moves.shift();
            if (move) {
                const [i, j] = move.indices;
                if (move.swap) {
                    columns[i].moveTo(columns[j], 1, props.frameCount);
                    columns[j].moveTo(columns[i], -1, props.frameCount);
                    [columns[i], columns[j]] = [columns[j], columns[i]];
                } else {
                    columns[i].jump(props.frameCount);
                    columns[j].jump(props.frameCount);
                }
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
                <Button onClick={onBubbleSort}>Bubble Sort</Button>
                <Button onClick={onQuickSort}>Quick Sort</Button>
                <Button onClick={onMergeSort}>Merge Sort</Button>
            </ButtonGroup>
        </Fragment>
    );
};

export default SortingAlgorithms;
