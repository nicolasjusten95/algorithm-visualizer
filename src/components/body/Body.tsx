import SortingAlgorithms from "./sortingAlgorithms/SortingAlgorithms";
import React, {useState} from "react";
import {Box} from "@mui/material";
import Settings from "./settings/Settings";


interface BodyProps {
    isShowSettings: boolean;
}

const Body = (props: BodyProps) => {

    const [arraySize, setArraySize] = useState<number>(20);
    const [frameCount, setFrameCount] = useState<number>(20);

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            flexGrow={1}>
            {props.isShowSettings ?
                <Settings
                    arraySize={arraySize}
                    setArraySize={setArraySize}
                    frameCount={frameCount}
                    setFrameCount={setFrameCount}/> :
                <SortingAlgorithms
                    arraySize={arraySize}
                    frameCount={frameCount}/>}
        </Box>
    );
};

export default Body;
