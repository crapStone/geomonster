import * as PIXI from "pixi.js";
import Map from "./map";
import Global from "./globals";
import IRunnable from "./types/IRunnable";

export default class TileSelector implements IRunnable {
    app: PIXI.Application;
    map: Map;
    sprites: Array<PIXI.Sprite> = [];
    container: PIXI.Container;

    constructor(app: PIXI.Application, map: Map) {
        this.app = app;
        this.map = map;
        this.container = new PIXI.Container();
        this.container.x = (app.screen.width / 4) * 3;
        this.container.y = (app.screen.height / 4) * 3;
        this.container.zIndex = 200;
        this.app.stage.addChild(this.container);
    }

    run() {
        const spriteSize = 60;
        let counter = 0;
        for (const key in this.map.textureMapping) {
            if (key !== 'default') {
                const textureName = this.map.textureMapping[key];
                let sprite = new PIXI.Sprite(this.app.loader.resources[textureName].texture);
                sprite.interactive = true;
                sprite.buttonMode = true;
                sprite.width = spriteSize;
                sprite.height = spriteSize;
                counter += sprite.width + 20;
                sprite.x = counter;

                sprite.on("pointerdown", (evt: PIXI.interaction.InteractionEvent) => {
                    evt.stopPropagation();
                    Global.spriteName = textureName;
                    console.log(Global.spriteName);
                });

                this.sprites.push(sprite);
                this.container.addChild(sprite);
            }
        }
    }
}
