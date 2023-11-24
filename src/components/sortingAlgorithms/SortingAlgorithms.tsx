import Canvas from "../canvas/Canvas";
import {Move, SortingResult} from "../../api/SortingApi";
import {Column} from "../../api/Column";
import {getMergeSortMoves} from "../../algorithms/sorting/MergeSort";
import {getQuickSortMoves} from "../../algorithms/sorting/QuickSort";
import {getBubbleSortMoves} from "../../algorithms/sorting/BubbleSort";
import {generateRandomArrayWithoutDuplicates} from "../../utils/ArrayUtils";
import {useEffect, useState} from "react";
import './SortingAlgorithms.css';
import {Button, Stack} from "@mui/material";

const CANVAS_WIDTH: number = 600;
const CANVAS_HEIGHT: number = 450;
const MAX_ELEMENT_HEIGHT: number = 300;
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
    }, []);

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
        ctx.canvas.width = CANVAS_WIDTH;
        ctx.canvas.height = CANVAS_HEIGHT;
        const spacing: number = (ctx.canvas.width - CANVAS_MARGIN * 2) / NUMBER_OF_ELEMENTS;
        for (let i = 0; i < array.length; i++) {
            const x: number = i * spacing + spacing / 2 + CANVAS_MARGIN;
            const y: number = ctx.canvas.height - CANVAS_MARGIN - i * 3;
            const width: number = spacing - MARGIN_BETWEEN_ELEMENTS;
            const height: number = MAX_ELEMENT_HEIGHT * array[i];
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
        <div>
            <div className='canvasContainer'>
                <Canvas draw={draw}/>
            </div>
            <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                <Button onClick={onGenerateNewArray} variant={'contained'}>Generate new array</Button>
                <Button onClick={onBubbleSort} variant={'contained'}>Bubble Sort</Button>
                <Button onClick={onQuickSort} variant={'contained'}>Quick Sort</Button>
                <Button onClick={onMergeSort} variant={'contained'}>Merge Sort</Button>
            </Stack>
        </div>
    );
};

export default SortingAlgorithms;
