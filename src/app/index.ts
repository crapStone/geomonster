import * as PIXI from 'pixi.js';
import * as Logger from "typescript-logger";
import registerAssetLoader from "./assetLoader";
import startLoop from "./gameLoop";
import IAnimated from "./types/IAnimated";
import Monster from './monster';

const log = Logger.LoggerManager.create("index");

const app = new PIXI.Application({
    width: 1080,  //window.innerWidth,
    height: 720,  //window.innerHeight,
});

document.body.appendChild(app.view);

registerAssetLoader(app);

let animations: Array<IAnimated> = [];

app.loader
    .load((_, resources) => {
        let monster = new Monster(app, resources);
        animations.push(monster);
        app.stage.addChild(monster.sprite);

        startLoop(app, animations);
    });
