import * as PIXI from 'pixi.js';
import * as Logger from "typescript-logger";
import AnimatedPlayer from './animatedPlayer';
import registerAssetLoader from "./assetLoader";
import MapEditor from './editor';
import startLoop from "./gameLoop";
import Map from "./map";
import TileSelector from './tileSelector';
import IAnimated from "./types/IAnimated";

const log = Logger.LoggerManager.create("index");

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
});
app.stage.sortableChildren = true;

document.body.appendChild(app.view);

registerAssetLoader(app);

let animations: Array<IAnimated> = [];

app.loader
    .load((_, resources) => {

        let map = new Map("", app, resources);
        map.registerListener();
        new MapEditor(app, map);
        const tileSelector = new TileSelector(app, map);
        map.registerAfterLoadCallback(tileSelector);

        startLoop(app, animations);

        // renderMap(app, resources);
    });
