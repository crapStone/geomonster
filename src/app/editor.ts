import * as PIXI from 'pixi.js';
import Map, { gridSize } from './map';
import Global from './globals';

export default class MapEditor {
    mapdata: string | any[];
    textureMapping: { monster: any; default?: any; tile1?: string; tile2?: string; tile3?: string; tile4?: string; };
    app: PIXI.Application;
    resources: Partial<Record<string, PIXI.LoaderResource>>;
    map: Map;
    texture: PIXI.Texture;
    data: PIXI.interaction.InteractionData;
    alpha: number;
    dragging: boolean;
    mouseOffset: { x: number, y: number };
    container: PIXI.Container = new PIXI.Container();


    constructor(app: PIXI.Application, map: Map) {
        this.app = app;
        this.map = map;
        this.map.resources

        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.hitArea = new PIXI.Rectangle(0, 0, this.app.screen.width, this.app.screen.height);
        this.container
            .on("pointerdown", this.onDragStart.bind(this))
            .on("pointerup", this.onDragEnd.bind(this))
            .on("pointerupoutside", this.onDragEnd.bind(this));

        this.app.stage.addChild(this.container);
    }

    onDragStart(evt: PIXI.interaction.InteractionEvent) {
        this.dragging = true;
        const pos = evt.data.getLocalPosition(evt.target.parent);
        this.mouseOffset = { x: this.evalueateGridPosition(pos.x, this.map.container.x, Math.floor), y: this.evalueateGridPosition(pos.y, this.map.container.y, Math.floor) };
    }

    evalueateGridPosition(currentPos: number, containerpos: number, func: { (x: number): number; }) {
        return func(((currentPos - containerpos) / gridSize) / this.map.container.scale.x);
    }

    onDragEnd(evt: PIXI.interaction.InteractionEvent) {
        console.log(Global.spriteName);
        const endPos = evt.data.getLocalPosition(evt.target.parent);
        const relativePos = { x: this.evalueateGridPosition(endPos.x, this.map.container.x, Math.floor), y: this.evalueateGridPosition(endPos.y, this.map.container.y, Math.floor) };

        if (this.mouseOffset.x === relativePos.x && this.mouseOffset.y === relativePos.y) {
            this.map.addTile(this.mouseOffset.x, this.mouseOffset.y, Global.spriteName);
        } else {
            this.map.addTiles(this.mouseOffset.x, this.mouseOffset.y, relativePos.x, relativePos.y, Global.spriteName);
        }
        this.dragging = false;
        this.map.redraw();
    }
}
