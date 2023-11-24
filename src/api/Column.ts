import {getPositionRelativeToTimeFrame} from "../utils/AnimationUtils";
import {QueueItem} from "./SortingApi";

export class Column {

    public x: number;
    public y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly queue: QueueItem[];

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.queue = [];
    };

    moveTo(location: { x: number, y: number }, yOffSet: number, frameCount: number) {
        for (let i = 1; i <= frameCount; i++) {
            const  t = i / frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: getPositionRelativeToTimeFrame(this.x, location.x, t),
                y: getPositionRelativeToTimeFrame(this.y, location.y, t) + u * this.width / 2 * yOffSet,
                swap: true,
            });
        }
    }

    jump(frameCount: number) {
        for (let i = 1; i <= frameCount; i++) {
            const t = i / frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: this.x,
                y: this.y - u * this.width,
                swap: false,
            })
        }
    }

    draw(context: CanvasRenderingContext2D): boolean {

        let changed = false;
        let colour = "rgb(150, 150, 150)";
        if (this.queue.length > 0) {
            const queueItem: QueueItem | undefined = this.queue.shift();
            if (queueItem) {
                this.x = queueItem.x;
                this.y = queueItem.y;
                colour = queueItem.swap ? "rgb(184, 20, 20)" : "rgb(76, 145, 65)";
                changed = true;
            }
        }

        const left = this.x - this.width / 2;
        const top = this.y - this.height;
        const right = this.x + this.width / 2;

        context.beginPath();
        context.fillStyle = colour;
        context.moveTo(left, top);
        context.lineTo(left, this.y);
        context.ellipse(this.x, this.y, this.width / 2, this.width / 4, 0, Math.PI,
            Math.PI * 2, true);
        context.lineTo(right, top);
        context.ellipse(this.x, top, this.width / 2, this.width / 4, 0, 0,
            Math.PI * 2, true);
        context.fill();
        context.stroke();

        return changed;
    }

}
