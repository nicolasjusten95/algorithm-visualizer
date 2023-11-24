import {MutableRefObject} from "react";
import useCanvas from "./useCanvas";

interface CanvasProps {
    draw: (context: CanvasRenderingContext2D) => void;
}

const Canvas = (props: CanvasProps) => {

    const {draw, ...rest} = props;
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useCanvas(props.draw);

    return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas;
