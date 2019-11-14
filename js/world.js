import {Entity} from "./entity.js";
import {WorldTile, TileType, TileSettings} from "./worldtile.js";

export class World {
    /** @type {Array<Entity>} entityList */
    #entityList = [];
    /** @type {Object<String, WorldTile>} */
    #tiles = {};
    /** @type {number} */
    #gravity = 0.5;
    /** @type {number} */
    #maximumSpeedOfFreeFall = 9.8;

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {Entity} entity Сущность
     * @returns {boolean}
     */
    addEntity(entity) {
        if (!(entity instanceof Entity)) {
            throw new Error('Invalid entity type');
        }

        this.#entityList.push(entity);
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {Entity} entity Сущность
     * @returns {boolean}
     */
    removeEntity(entity) {
        if (!(entity instanceof Entity)) {
            throw new Error('Invalid entity type');
        }

        const index = this.#entityList.indexOf(entity);
        if (index !== -1) this.#entityList.splice(index, 1);
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} x Сущность
     * @param {number} y
     * @param {WorldTile} tile
     */
    setTileAt(x, y, tile) {
        if (!(tile instanceof WorldTile)) {
            throw new Error('Unknown tile type');
        }

        this.#tiles[`${x}:${y}`] = tile;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} x координата
     * @param {number} y координата
     * @returns {WorldTile}
     */
    getTileAt(x, y) {
        const yF = parseInt(y / TileSettings.DEFAULT_SIZE, 10);
        const xF = parseInt(x / TileSettings.DEFAULT_SIZE, 10);

        const searchTile = this.#tiles[`${xF}:${yF}`];

        return searchTile ? searchTile : new WorldTile(this, xF, yF, TileType.AIR);
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @returns {WorldTile[]}
     */
    getTiles() {
        return this.#tiles;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @returns {Entity[]}
     */
    getEntities() {
        return this.#entityList;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @returns {Entity[]}
     */
    getNearbyEntities(x, y, radius) {
        const foundEntities = [];

        for (const entity of this.#entityList) {
            const diffY = entity.getY() - y;
            const diffX = entity.getX() - x;
            const inXRadius = (diffX <= 0 && diffX >= -radius) || (diffX >= 0 && diffX <= radius);
            const inYRadius = (diffY <= 0 && diffY >= -radius) || (diffY >= 0 && diffY <= radius);
            if (inXRadius && inYRadius) {
                foundEntities.push(entity);
            }
        }

        return foundEntities;
    }

    /**
     * Возвращает тайл на указанных координатах
     */
    update() {
        for (const entity of this.#entityList) {
            try {
                entity.update();
            } catch (e) {
                console.error('Exception while update entity');
                console.error(entity);
                this.removeEntity(entity);
            }
        }

        for (const tileId in this.#tiles) {
            if (!this.#tiles.hasOwnProperty(tileId)) {
                continue
            }
            const tile = this.#tiles[tileId];

            try {
                tile.update();
            } catch (e) {
                console.error('Exception while update tile');
                console.error(tile);
            }
        }
    }

    /**
     *
     * @returns {number}
     */
    getGravity() {
        return this.#gravity;
    }

    /**
     *
     * @returns {number}
     */
    getMaximumSpeedOfFreeFall() {
        return this.#maximumSpeedOfFreeFall;
    }
}