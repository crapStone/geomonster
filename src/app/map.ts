import * as PIXI from 'pixi.js';
import IRunnable from "./types/IRunnable";
import { rectIntersect } from './collision';


export const gridSize = 40;


export default class Map {
    mapData: Array<Array<number>>;
    textureMapping: { [id: number]: string | undefined };
    reverseTextureMapping: { [name: string]: number };
    properties: { background: string; };
    textureOffset;

    app;
    resources: { [x: string]: { texture: PIXI.Texture; }; };

    container: PIXI.Container = new PIXI.Container();

    eventListener;
    afterLoadCallbacks: Array<IRunnable> = [];
    afterLoadCallbacksRun: boolean = false;

    constructor(name: string, app: PIXI.Application, resources: Partial<Record<string, PIXI.LoaderResource>>) {
        this.app = app;
        this.resources = resources;

        import(`../../assets/mapTest.json`).then((result) => {
            console.log("loaded map");

            this.mapData = result.data;
            this.textureMapping = result.textureMapping;
            this.reverseTextureMapping = {};
            this.properties = result.properties;
            this.textureOffset = result.textureOffset;

            for (let key in this.textureMapping) {
                this.reverseTextureMapping[this.textureMapping[key]] = +key;
            }

            this.afterLoadCallbacksRun = true;
            this.afterLoadCallbacks.forEach((obj) => obj.run());

            this.redraw();
        })
    }

    redraw() {
        console.log("redraw");

        let oldScale;
        let oldPos;

        if (this.container) {
            oldScale = this.container.scale;
            oldPos = this.container.position;

            this.app.stage.removeChild(this.container);
        }
        else {
            oldScale = new PIXI.Point(1, 1);
            oldPos = new PIXI.Point();
        }

        this.container = new PIXI.Container();
        this.container.position.set(oldPos.x, oldPos.y);
        this.container.scale = new PIXI.Point(oldScale.x, oldScale.y);

        this.create();
    }

    create() {
        console.log("create");
        const size = gridSize;

        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                const textureId = this.mapData[y][x];

                const textureName = this.textureMapping[textureId];

                if (textureName) {
                    let sprite = new PIXI.Sprite(this.resources[textureName].texture);

                    sprite.height = size;
                    sprite.width = size;

                    sprite.x = x * size;
                    sprite.y = y * size;

                    if (textureId in this.textureOffset) {
                        sprite.anchor.y = this.textureOffset[textureId].anchorY;
                        sprite.anchor.x = this.textureOffset[textureId].anchorX;
                        sprite.height = size + this.textureOffset[textureId].heightOffset;
                        sprite.rotation = this.textureOffset[textureId].rotation;
                    }

                    this.container.addChild(sprite);
                }
            }
        }

        this.app.stage.addChild(this.container);
    }

    appendTextureMappings(textureName: string) {
        const len = Object.keys(this.textureMapping).length + 1;

        this.textureMapping[len] = textureName;
        this.reverseTextureMapping[textureName] = len;
    }

    fillMapIfNeeded(xPos: number, yPos: number) {
        if (this.mapData.length <= yPos) {
            for (let y = this.mapData.length; y <= yPos; y++) {
                this.mapData.push([]);
            }
        }

        const yMapData = this.mapData[yPos];

        if (yMapData.length <= xPos) {
            for (let x = yMapData.length; x < xPos; x++) {
                yMapData.push(0);
            }
        }
    }

    addTile(xPos: number, yPos: number, textureName: string) {
        if (!(textureName in this.reverseTextureMapping)) {
            this.appendTextureMappings(textureName);
        }

        this.fillMapIfNeeded(xPos, yPos);

        this.mapData[yPos][xPos] = this.reverseTextureMapping[textureName] as number;
    }

    addTiles(xStart, yStart, xEnd, yEnd, textureName) {
        if (xStart > xEnd) {
            const tmp = xStart;
            xStart = xEnd;
            xEnd = tmp;
        }

        if (yStart > yEnd) {
            const tmp = yStart;
            yStart = yEnd;
            yEnd = tmp;
        }

        if (!(textureName in this.reverseTextureMapping)) {
            this.appendTextureMappings(textureName);
        }

        for (let yPos = yStart; yPos <= yEnd; yPos++) {
            this.fillMapIfNeeded(xEnd, yPos);

            for (let xPos = xStart; xPos <= xEnd; xPos++) {
                this.mapData[yPos][xPos] = this.reverseTextureMapping[textureName] as number;
            }
        }
    }

    saveMap() {
        console.log("saveMap");

        const toSerialize = {
            textureMapping: this.textureMapping,
            properties: this.properties,
            data: this.mapData,
        };

        const json = JSON.stringify(toSerialize);

        let dataStr = "data:text/json;charset=uft-8," + encodeURIComponent(json);
        let downloadNode = document.createElement('a');
        downloadNode.setAttribute("href", dataStr);
        downloadNode.setAttribute("download", "map.json");
        document.body.appendChild(downloadNode);
        downloadNode.click();
        downloadNode.remove();
    }

    collidesWithMap(x: number, y: number, w: number, h: number) {
        const maxOffset = 3;
        // console.log("collision check", x, y, w, h);
        const xIdx = Math.floor(x / 40);
        const yIdx = Math.floor(y / 40);
        // console.log("new", xIdx, yIdx);

        for (let row = Math.max(0, yIdx - maxOffset); row < Math.min(this.mapData.length, yIdx + maxOffset); row++) {
            const rowTiles = this.mapData[row];

            if (rowTiles) {
                for (let tile = Math.max(0, xIdx - maxOffset); tile < Math.min(rowTiles.length, xIdx + maxOffset); tile++) {
                    const tileData = rowTiles[tile];
                    if (tileData) {
                        if (rectIntersect(x, y, w, h, tile * 40, row * 40, 40, 40)) {
                            return { x: tile * 40, y: row * 40, w: 40, h: 40 };
                        };
                    }
                }
            }
        }
        return false;
    }

    registerAfterLoadCallback(obj: IRunnable) {
        if (!this.afterLoadCallbacksRun) {
            this.afterLoadCallbacks.push(obj);
        }
        else {
            obj.run();
        }
    }

    registerListener() {
        this.eventListener = this.keyEventHandler.bind(this);
        window.addEventListener("keydown", this.eventListener);
    }

    unregisterListener() {
        window.removeEventListener("keydown", this.eventListener);
    }

    keyEventHandler(evt: { key: string; preventDefault: () => void; }) {
        let x = 0;
        let y = 0;

        let sx = 0;
        let sy = 0;

        let changed = false;

        if (evt.key === "ArrowDown") {
            changed = true;
            y += 10;
        }
        if (evt.key === "ArrowUp") {
            changed = true;
            y -= 10;
        }
        if (evt.key === "ArrowLeft") {
            changed = true;
            x -= 10;
        }
        if (evt.key === "ArrowRight") {
            changed = true;
            x += 10;
        }

        if (evt.key === "w") {
            changed = true;
            sx += .1;
            sy += .1;
        }
        if (evt.key === "q") {
            changed = true;
            sx -= .1;
            sy -= .1;
        }
        if (evt.key === "a") {
            this.addTiles(0, 9, 0, 0, "tile4");
            this.redraw();
        }
        if (evt.key === "s") {
            this.saveMap();
        }

        if (changed) {
            const newX = this.container.x + x;
            const newY = this.container.y + y;

            const newSX = this.container.scale.x + sx;
            const newSY = this.container.scale.y + sy;

            this.container.position.set(newX, newY);
            this.container.scale.set(newSX, newSY);

            evt.preventDefault();
        }
    }
}
