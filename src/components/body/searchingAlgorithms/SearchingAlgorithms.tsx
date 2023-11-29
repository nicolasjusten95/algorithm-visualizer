import {Fragment, useEffect, useState} from "react";
import {Column} from "../../../api/Column";
import {generateRandomArrayWithoutDuplicates} from "../../../utils/ArrayUtils";
import Canvas, {resizeCanvasToContainerSize} from "../canvas/Canvas";
import {Box, Button, ButtonGroup} from "@mui/material";
import {getQuickSortMoves} from "../../../algorithms/sorting/QuickSort";
import {SearchMove, SearchResult} from "../../../api/SearchingApi";
import {getLinearSearchMoves} from "../../../algorithms/searching/LinearSearch";
import {Settings} from "../../../api/SettingsApi";
import {calculateColumns} from "../../../utils/CanvasUtils";
import {getBinarySearchMoves} from "../../../algorithms/searching/BinarySearch";
import {getInterpolationSearchMoves} from "../../../algorithms/searching/InterpolationSearch";


const SearchingAlgorithms = (props: Settings) => {

    const [array, setArray] = useState<number[]>([]);
    const [value, setValue] = useState<number>(5);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [columns, setColumns] = useState<Column[]>([]);
    const [moves, setMoves] = useState<SearchMove[]>([]);

    useEffect(() => {
        if (canvasContext) {
            resetExample(canvasContext);
        }
        // Re-render component if screensize changes to adjust canvas
        window.addEventListener('resize', onGenerateNewArray);
        return () => {
            window.removeEventListener('resize', onGenerateNewArray);
        }
    }, [canvasContext]);

    const resetExample = (canvasContext: CanvasRenderingContext2D): void => {
        const newArray: number[] = generateRandomArrayWithoutDuplicates(props.arraySize);
        getQuickSortMoves(newArray);
        const newValue: number = newArray[Math.floor(Math.random() * newArray.length)];
        const newColumns: Column[] = calculateColumns(newArray, newValue, canvasContext);
        setArray(newArray);
        setValue(newValue);
        setColumns(newColumns);
        setMoves([]);
    }

    function onGenerateNewArray() {
        if (canvasContext) {
            resetExample(canvasContext);
        }
    }

    function onLinearSearch() {
        const result: SearchResult = getLinearSearchMoves(array, value);
        setMoves(result.moves);
    }

    function onBinarySearch() {
        const result: SearchResult = getBinarySearchMoves(array, value);
        setMoves(result.moves);
    }

    function onInterpolationSearch() {
        const result: SearchResult = getInterpolationSearchMoves(array, value);
        setMoves(result.moves);
    }


    const draw = (context: CanvasRenderingContext2D): void => {
        setCanvasContext(context);
        if (!canvasContext) {
            return;
        }
        resizeCanvasToContainerSize(canvasContext.canvas);
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
