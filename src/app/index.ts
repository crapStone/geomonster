import * as PIXI from 'pixi.js';
// import * as url from './resources/monster.png';

const app = new PIXI.Application();

document.body.appendChild(app.view);

app.loader.add('monster', '../../assets/monster.png').load((_, resources) => {
    const monster = new PIXI.Sprite(resources.monster.texture);
    console.log(resources.monster.texture);

    monster.x = app.renderer.width / 2;
    monster.y = app.renderer.height / 2;

    monster.anchor.x = .5;
    monster.anchor.y = .5;

    app.stage.addChild(monster);

    app.ticker.add(() => {
        monster.rotation += .001;
    });
});
