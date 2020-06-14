import * as PIXI from 'pixi.js';
import "pixi-sound";

export default class SoundPlayer {
    resources;

    constructor(resources) {
        this.resources = resources;

        const sound: PIXI.sound.Sound = resources["music_background"].sound;
        sound.volume = .25;
        let instance = sound.play({loop:true});
    }

}