import Canvas, {resizeCanvasToContainerSize} from "../canvas/Canvas";
import {Move, SortingResult} from "../../../api/SortingApi";
import {Column} from "../../../api/Column";
import {getMergeSortMoves} from "../../../algorithms/sorting/MergeSort";
import {getQuickSortMoves} from "../../../algorithms/sorting/QuickSort";
import {getBubbleSortMoves} from "../../../algorithms/sorting/BubbleSort";
import {generateRandomArrayWithoutDuplicates} from "../../../utils/ArrayUtils";
import {useEffect, useState} from "react";
import {Box, Button, ButtonGroup, Slider, Typography} from "@mui/material";


const MAX_RELATIVE_HEIGHT_FOR_COLUMNS: number = 0.65;
const FACTOR_FOR_DIAGONAL_SHIFT: number = 2.5;
const CANVAS_MARGIN: number = 20;
const MARGIN_BETWEEN_ELEMENTS: number = 4;

const SortingAlgorithms = () => {

    const [array, setArray] = useState<number[]>([]);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [arraySize, setArraySize] = useState<number>(20);
    const [frameCount, setFrameCount] = useState<number>(20);

    const columns: Column[] = [];
    let moves: Move[] = [];

    useEffect(() => {
        resetArray();
    }, [arraySize]);

    useEffect(() => {
        setArray(array);
    }, [frameCount, array]);

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
        const newArray: number[] = generateRandomArrayWithoutDuplicates(arraySize);
        setArray(newArray);
    }

    function onGenerateNewArray() {
        resetArray();
    }

    function onChangeArraySize(event: Event, newValue: number | number[]) {
        setArraySize(newValue as number);
    }

    function onChangeFrameCount(event: Event, newValue: number | number[]) {
        setFrameCount(newValue as number);
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
        const spacing: number = (canvasContext.canvas.width - CANVAS_MARGIN * 2) / array.length;
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
                    columns[i].moveTo(columns[j], 1, frameCount);
                    columns[j].moveTo(columns[i], -1, frameCount);
                    [columns[i], columns[j]] = [columns[j], columns[i]];
                } else {
                    columns[i].jump(frameCount);
                    columns[j].jump(frameCount);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            flexGrow={1}>
            <Box
                width='50%'
                display='flex'
                justifyContent='space-between'
                sx={{flexDirection: {xs: 'column', md: 'row'}}}>
                <Box sx={{width: {xs: '100%', md: '45%'}}}>
                <Typography>Array Size</Typography>
                <Slider
                    value={arraySize}
                    onChange={onChangeArraySize}
                    step={1}
                    min={2}
                    max={50}
                    valueLabelDisplay='auto'/>
                </Box>
                <Box sx={{width: {xs: '100%', md: '45%'}}}>
                <Typography>Frames Per Animation</Typography>
                <Slider
                    value={frameCount}
                    onChange={onChangeFrameCount}
                    step={1}
                    min={1}
                    max={50}
                    valueLabelDisplay='auto'/>
                </Box>
            </Box>
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
        </Box>
    );
};

export default SortingAlgorithms;
