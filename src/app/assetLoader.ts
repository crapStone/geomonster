import * as PIXI from 'pixi.js';
import * as textures from "../../assets/textures.json"
import * as Logger from "typescript-logger";

const log = Logger.LoggerManager.create("assetLoader");

export default function registerAssetLoader(app: PIXI.Application) {
    app.loader.on("progress", (loader: { progress: any; }, resource: { name: any; url: any; }) => {
        log.debug("loading", loader.progress, resource.name, resource.url);
    });

    for (let name in textures) {
        if (!(name == "default")) {
            app.loader.add(name, textures[name]);
        }
    }
}
