import * as PIXI from 'pixi.js';
import IAnimated from "./types/IAnimated";
import Map from './map';
import * as Logger from 'typescript-logger';

const log = Logger.LoggerManager.create("monster");

const g = 2.8;

const gravity = true;

export default class Monster implements IAnimated {
    leftTexture;
    rightTexture;
    sprite: PIXI.Sprite;
    container: PIXI.Container;
    acceleration: PIXI.Point;
    velocity: PIXI.Point;
    mapOffset: PIXI.Point;
    map: Map;

    eventListener;

    delta = 0;
    onGround = false;

    constructor(app: PIXI.Application, resources: Partial<Record<string, PIXI.LoaderResource>>, map: Map) {
        this.map = map;

        this.leftTexture = app.loader.resources["../../assets/monster/monsterComplete.json"].textures["monsterCompleteRight.png"];
        this.rightTexture = app.loader.resources["../../assets/monster/monsterComplete.json"].textures["monsterCompleteLeft.png"];

        this.sprite = new PIXI.Sprite(this.rightTexture);
        this.sprite.x = app.renderer.width / 2;
        this.sprite.y = app.renderer.height / 2;

        this.sprite.width = 50;
        this.sprite.height = 60;

        this.acceleration = new PIXI.Point();
        this.velocity = new PIXI.Point();
        this.mapOffset = new PIXI.Point(this.sprite.position.x, this.sprite.position.y);

        this.sprite.anchor.x = .5;
        this.sprite.anchor.y = 1;

        this.container = new PIXI.Container();
        this.container.width = this.sprite.width;
        this.container.height = this.container.height;
        this.container.zIndex = 100;
        this.container.addChild(this.sprite);

        app.stage.addChild(this.container);
    }

    /**
     * @override
     */
    tick(delta: number): void {
        // this.sprite.rotation += .01 * delta;
        this.delta += .05;
        this.sprite.position.y += .1 * Math.sin(this.delta);

        // if (this.velocity.x > 0) {
        //     this.sprite.angle = 350;
        // }
        // else if (this.velocity.x < 0) {
        //     this.sprite.angle = 10;
        // } else {
        //     this.sprite.angle = 0;
        // }

        if (this.velocity.x > 0) {
            this.sprite.texture = this.leftTexture;
        }
        else if (this.velocity.x < 0) {
            this.sprite.texture = this.rightTexture;
        }

        this.runPhysics(delta);
    }

    runPhysics(delta) {
        // Apply acceleration
        if (gravity) { this.velocity.y += g * delta; }

        // Move with set velocity
        const deltaX = this.velocity.x * delta
        const deltaY = this.velocity.y * delta

        this.map.container.position.x += deltaX;
        this.map.container.position.y -= deltaY;

        this.velocity.x *= .8;

        if (Math.abs(this.velocity.x) < .2) {
            this.velocity.x = 0;
        }

        this.checkCollision();
    }

    checkCollision() {
        const xPos = this.mapOffset.x - this.map.container.position.x;
        const yPos = this.mapOffset.y - this.map.container.position.y;

        const isColliding = this.map.collidesWithMap(xPos - this.sprite.width / 2, yPos - this.sprite.height, this.sprite.width, this.sprite.height)

        if (isColliding) {
            this.velocity.y = 0;
            this.onGround = true;

            if (gravity) { this.map.container.y += yPos - isColliding.y; }
        }
        else {
            this.onGround = false;
        }

        return isColliding;
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

        let changed = false;

        if (gravity) {
            if (evt.key === "ArrowUp" && this.onGround) {
                changed = true;
                this.velocity.y = -20;
            }
        }
        else {
            if (evt.key === "ArrowDown") {
                changed = true;
                y -= 10;
            }
            if (evt.key === "ArrowUp") {
                changed = true;
                y += 10;
            }
        }
        if (evt.key === "ArrowLeft") {
            changed = true;
            this.velocity.x = 10;
        }
        if (evt.key === "ArrowRight") {
            changed = true;
            this.velocity.x = -10;
        }

        if (evt.key === "a") {
            log.debug("collision", this.checkCollision());
        }


        if (changed) {
            // this.map.container.position.set(this.map.container.position.x + x, this.map.container.position.y + y);

            evt.preventDefault();
        }
    }
}
