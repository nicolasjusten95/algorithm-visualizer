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

    const cols: Column[] = [];
    let moves: Move[] = [];
    let ctx: CanvasRenderingContext2D;

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
        const result: SortingResult = getBubbleSortMoves(array);
        moves = result.moves;
    }

    function onQuickSort() {
        const result: SortingResult = getQuickSortMoves(array);
        moves = result.moves;
    }

    function onMergeSort() {
        const result: SortingResult = getMergeSortMoves(array);
        moves = result.moves;
    }

    const draw = (context: CanvasRenderingContext2D): void => {
        ctx = context;
        resizeCanvasToContainerSize(ctx.canvas);
        const spacing: number = (ctx.canvas.width - CANVAS_MARGIN * 2) / NUMBER_OF_ELEMENTS;
        for (let i = 0; i < array.length; i++) {
            const x: number = i * spacing + spacing / 2 + CANVAS_MARGIN;
            const y: number = ctx.canvas.height - CANVAS_MARGIN - i * FACTOR_FOR_DIAGONAL_SHIFT;
            const width: number = spacing - MARGIN_BETWEEN_ELEMENTS;
            const height: number = ctx.canvas.height * MAX_RELATIVE_HEIGHT_FOR_COLUMNS * array[i];
            cols[i] = new Column(x, y, width, height);
        }
        animate();
    }

    function animate() {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let changed = false;
        for (const col of cols) {
            changed = col.draw(ctx) || changed;
        }

        if (!changed && moves.length > 0) {
            const move: Move | undefined = moves.shift();
            if (move) {
                const [i, j] = move.indices;
                if (move.swap) {
                    cols[i].moveTo(cols[j], 1, FRAME_COUNT);
                    cols[j].moveTo(cols[i], -1, FRAME_COUNT);
                    [cols[i], cols[j]] = [cols[j], cols[i]];
                } else {
                    cols[i].jump(FRAME_COUNT);
                    cols[j].jump(FRAME_COUNT);
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
