import * as PIXI from 'pixi.js';
import * as Logger from "typescript-logger";

const log = Logger.LoggerManager.create("map");


export default class Map {
    mapData: string | any[];
    textureMapping: { [x: number]: string; };
    properties: { background: string; };

    app: { stage: { addChild: (arg0: any) => void; }; };
    resources: { [x: string]: { texture: PIXI.Texture; }; };

    container: PIXI.Container;

    constructor(name: string, app: PIXI.Application, resources: Partial<Record<string, PIXI.LoaderResource>>) {
        this.app = app;
        this.resources = resources;

        this.container = new PIXI.Container();
        this.container.scale = new PIXI.Point(1, 1);

        import(`../../assets/mapTest.json`).then((result) => {
            log.debug("loaded map");

            this.mapData = result.data;
            this.textureMapping = result.textureMapping;
            this.properties = result.properties;

            this.create();
        })
    }

    create() {
        const size = 40;

        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                const textureId = this.mapData[y][x];

                let sprite = new PIXI.Sprite(this.resources[this.textureMapping[textureId]].texture);

                sprite.height = size;
                sprite.width = size;

                sprite.x = x * size;
                sprite.y = y * size;

                this.container.addChild(sprite);
            }
        }

        this.app.stage.addChild(this.container);
        // this.app.ticker.add(this.render);
        window.addEventListener("keydown", this.keyEventHandler.bind(this));
    }

    keyEventHandler(evt: { key: string; preventDefault: () => void; }) {
        let x = this.container.x;
        let y = this.container.y;

        let sx = this.container.scale.x;
        let sy = this.container.scale.y;

        if (evt.key === "ArrowDown") {
            log.debug("ArrowDown");
            y += 10;
        }
        if (evt.key === "ArrowUp") {
            log.debug("ArrowUp");
            y -= 10;
        }
        if (evt.key === "ArrowLeft") {
            log.debug("ArrowLeft");
            x -= 10;
        }
        if (evt.key === "ArrowRight") {
            log.debug("ArrowRight");
            x += 10;
        }

        if (evt.key === "w") {
            log.debug("zoom in");
            sx += .1;
            sy += .1;
        }
        if (evt.key === "q") {
            log.debug("zoom out");
            sx -= .1;
            sy -= .1;
        }

        this.container.position.set(x, y);
        this.container.scale.set(sx, sy);

        evt.preventDefault();
    }
}
