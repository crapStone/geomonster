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
    .add("../../assets/monster/monsterComplete.json")
    .load((_, resources) => {
        const sprite = new PIXI.Sprite(app.loader.resources['background'].texture);
        sprite.position.x = 0;
        sprite.position.y = 0;
        sprite.width = app.screen.width;
        sprite.height = app.screen.height;
        app.stage.addChild(sprite);

        let map = new Map("", app, resources);
        map.registerListener();
        // new MapEditor(app, map);
        // const tileSelector = new TileSelector(app, map);
        // map.registerAfterLoadCallback(tileSelector);

        // TODO move this to a better location
        // const animatedPlayer = new AnimatedPlayer(app);
        // animations.push(animatedPlayer);
        // app.stage.addChild(animatedPlayer.container);

        startLoop(app, animations);

        // renderMap(app, resources);
    });
