import * as PIXI from 'pixi.js';
import IAnimated from "./types/IAnimated";

export default class Monster implements IAnimated {
    sprite: PIXI.Sprite;

    constructor(app: PIXI.Application, resources: Partial<Record<string, PIXI.LoaderResource>>) {
        this.sprite = new PIXI.Sprite(resources.monster.texture);

        this.sprite.x = app.renderer.width / 2;
        this.sprite.y = app.renderer.height / 2;

        this.sprite.anchor.x = .5;
        this.sprite.anchor.y = .5;

        // app.stage.addChild(this.monster);
    }

    /**
     * @override
     */
    tick(delta: number): void {
        this.sprite.rotation += .01 * delta;
    }
}
