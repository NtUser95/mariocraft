import {World} from "./world.js";

export class WorldTile {
    /** @type {number} */
    #type;
    /** @type {World} */
    #world;
    /** @type {number} */
    #x;
    /** @type {number} */
    #y;

    constructor(world, x, y, tileType) {
        this.#world = world;
        this.#x = x;
        this.#y = y;
        this.#type = tileType;
    }

    update() {

    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number} тип тайла
     */
    getX() {
        return this.#x;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number} тип тайла
     */
    getY() {
        return this.#y;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {World} тип тайла
     */
    getWorld() {
        return this.#world;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number} тип тайла
     */
    getType() {
        return this.#type;
    }
}

/**
 *
 * @type {{TEXTURE: number, AIR: number, WATER: number}}
 */
export const TileType = {
    AIR: 1,
    WATER: 2,
    TEXTURE: 3,
};

/**
 *
 * @type {{DEFAULT_SIZE: number}}
 */
export const TileSettings = {
    DEFAULT_SIZE: 50,
};