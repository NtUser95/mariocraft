import {Projectile} from "./projectile.js";

export class PlayerBullet extends Projectile {
    /** @type {number} */
    #hardness = 0.0;
    /** @type {number} */
    #bounceCounter = 0;
    /** @type {boolean} */
    #flying = false;

    /**
     * @return {boolean}
     */
    isFlying() {
        return this.#flying;
    }

    /**
     * @param {boolean} trueOrFalse
     */
    setFlying(trueOrFalse) {
        this.#flying = trueOrFalse;
    }

    /**
     *
     * @returns {number}
     */
    getHardness() {
        return this.#hardness;
    }

    /**
     *
     * @param {number} h
     */
    setHardness(h) {
        this.#hardness = h;
    }

    /**
     *
     * @param {WorldTile} tile
     */
    onTileInteract(tile) {
        if (this.#bounceCounter++ > 4) {
            this.getWorld().removeEntity(this);
        }
    }
}