import * as PIXI from 'pixi.js';
import IAnimated from "./types/IAnimated";

export default function startLoop(app: PIXI.Application, animations: Array<IAnimated>) {
    app.ticker.add((delta: number) => {
        animations.forEach((animation) => {
            animation.tick(delta);
        })
    });
}
