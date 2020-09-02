import { ObjectBase } from '../base/objectBase';

export class ChartMetaData extends ObjectBase {
    component: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;

    setDragPosition(position) {
        this.x += position.distance.x;
        this.y += position.distance.y;
        return this;
    }

    constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
    }
}
