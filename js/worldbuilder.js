import {World} from "./world.js";
import {WorldTile} from "./worldtile.js";

export class WorldBuilder {
    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {string} levelName
     * @return {World} тип тайла
     */
    static async createFromFile(levelName) {
        const level = await import(`./levels/${levelName}.js`);
        const world = new World();

        for(const tile of level.tiles) {
            const worldTile = new WorldTile(world, tile.x, tile.y, tile.type);
            world.setTileAt(tile.x, tile.y, worldTile);
        }

        for(const entity of level.entities) {
            world.addEntity(entity);
        }

        return world;
    }
}