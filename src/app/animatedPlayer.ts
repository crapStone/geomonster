import * as PIXI from "pixi.js";
import IAnimated from "./types/IAnimated";

export default class AnimatedPlayer implements IAnimated {
    container: PIXI.Container;
    app: PIXI.Application;
    leftMonster: PIXI.Sprite;
    rightMonster: PIXI.Sprite;
    animationDelta: number = 0;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.container.zIndex = 20;
        this.app = app;

        // let sheet = app.loader.resources["../../assets/monster/monsterSpriteSheet.json"].;
        // this.sprite = new PIXI.Sprite(app.loader.resources["../../assets/monster/monsterSpriteSheet.json"].textures["Body_Side.png"]);
        // this.sprite.height = this.sprite.height / 35;
        // this.sprite.width = this.sprite.width / 35;
        // const eye = new PIXI.Sprite(app.loader.resources["../../assets/monster/monsterSpriteSheet.json"].textures["Eyes_Side.png"]);
        // eye.position.x = 350;
        // eye.position.y = 300;

        // this.sprite.addChild(eye);

        this.leftMonster = new PIXI.Sprite(app.loader.resources["../../assets/monster/monsterComplete.json"].textures["monsterCompleteLeft.png"]);
        this.rightMonster = new PIXI.Sprite(app.loader.resources["../../assets/monster/monsterComplete.json"].textures["monsterCompleteRight.png"]);

        this.container.addChild(this.leftMonster);
        this.container.addChild(this.rightMonster);
        // this.app.stage.addChild(this.container);
    }

    tick(delta: number): void {
        // this.animationDelta += .05;
        // this.leftMonster.position.y += .1 * Math.sin(this.animationDelta);
    }
}
