import Canvas, {resizeCanvasToContainerSize} from "../canvas/Canvas";
import {Move, SortingResult} from "../../../api/SortingApi";
import {Column} from "../../../api/Column";
import {getMergeSortMoves} from "../../../algorithms/sorting/MergeSort";
import {getQuickSortMoves} from "../../../algorithms/sorting/QuickSort";
import {getBubbleSortMoves} from "../../../algorithms/sorting/BubbleSort";
import {generateRandomArrayWithoutDuplicates} from "../../../utils/ArrayUtils";
import {useEffect, useState} from "react";
import {Box, Button, ButtonGroup} from "@mui/material";


const MAX_RELATIVE_HEIGHT_FOR_COLUMNS: number = 0.65;
const FACTOR_FOR_DIAGONAL_SHIFT: number = 2.5;
const CANVAS_MARGIN: number = 20;
const MARGIN_BETWEEN_ELEMENTS: number = 4;
const NUMBER_OF_ELEMENTS: number = 20;
const FRAME_COUNT: number = 20;

const SortingAlgorithms = () => {

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
        const newArray: number[] = generateRandomArrayWithoutDuplicates(NUMBER_OF_ELEMENTS);
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
        const spacing: number = (canvasContext.canvas.width - CANVAS_MARGIN * 2) / NUMBER_OF_ELEMENTS;
        for (let i = 0; i < array.length; i++) {
            const x: number = i * spacing + spacing / 2 + CANVAS_MARGIN;
            const y: number = canvasContext.canvas.height - CANVAS_MARGIN - i * FACTOR_FOR_DIAGONAL_SHIFT;
            const width: number = spacing - MARGIN_BETWEEN_ELEMENTS;
            const height: number = canvasContext.canvas.height * MAX_RELATIVE_HEIGHT_FOR_COLUMNS * array[i];
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
                    columns[i].moveTo(columns[j], 1, FRAME_COUNT);
                    columns[j].moveTo(columns[i], -1, FRAME_COUNT);
                    [columns[i], columns[j]] = [columns[j], columns[i]];
                } else {
                    columns[i].jump(FRAME_COUNT);
                    columns[j].jump(FRAME_COUNT);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
            <Box width={'50%'} minWidth={'350px'} m={2} id={'canvasContainer'}>
                <Canvas draw={draw}/>
            </Box>
            <ButtonGroup variant={'contained'} sx={{m: 2}}>
                <Button onClick={onGenerateNewArray}>Generate new array</Button>
                <Button onClick={onBubbleSort}>Bubble Sort</Button>
                <Button onClick={onQuickSort}>Quick Sort</Button>
                <Button onClick={onMergeSort}>Merge Sort</Button>
            </ButtonGroup>
        </Box>
    );
};

export default SortingAlgorithms;
