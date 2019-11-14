import {Entity} from "./entity.js";
import {TileType, WorldTile} from "./worldtile.js";
import {LivingEntity} from "./livingentity.js";

export class Projectile extends Entity {
    /** @type {boolean} */
    #flying = true;
    /** @type {Entity} */
    #shooter;
    /** @type {number} */
    #height = 15.0;
    /** @type {number} */
    #width = 15.0;
    /** @type {number} */
    #damage = 5.0;

    update() {
        super.update();

        const cV = this.getVelocity();
        // Расчитаем точку, в которую сместится энтити.
        const movX = cV.x > 0.0 ? this.getX() + (this.getWidth() / 2) + cV.x : this.getX() - (this.getWidth() / 2) - cV.x;
        const movY = cV.y > 0.0 ? this.getY() + (this.getHeight() / 2) + cV.y : this.getY() - (this.getHeight() / 2) - cV.y;
        const tileAtDirection = this.getWorld().getTileAt(movX, movY);
        if (tileAtDirection.getType() === TileType.TEXTURE) {
            this.onTileInteract(tileAtDirection)
        }
        const entities = this.getCollisionWithEntityInDirection(direction);
        if (entities.length) {
            this.onEntityInteract(entities.shift());
        }
    }

    /**
     *
     * @returns {number}
     */
    getWidth() {
        return this.#width;
    }

    /**
     *
     * @param {number} pixels
     */
    setWidth(pixels) {
        this.#width = pixels;
    }

    /**
     *
     * @returns {number}
     */
    getHeight() {
        return this.#height;
    }

    /**
     *
     * @param {number} pixels
     */
    setHeight(pixels) {
        this.#height = pixels;
    }

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

    onDestroy() {
        console.log('projectile destroy');
    }

    /**
     *
     * @param {Entity} entity
     */
    setShooter(entity) {
        if (!(entity instanceof LivingEntity)) {
            throw new Error('Invalid entity type');
        }

        this.#shooter = entity;
    }

    /**
     *
     * @returns {Entity}
     */
    getShooter() {
        return this.#shooter;
    }

    /**
     *
     * @returns {number}
     */
    getDamage() {
        return this.#damage;
    }

    /**
     *
     * @param {number} damage
     */
    setDamage(damage) {
        this.#damage = damage;
    }

    /**
     * Вызывается при взаимодействии с сущностью
     *
     * @param {Entity} entity
     */
    onEntityInteract(entity) {
        if (!(entity instanceof Entity)) {
            throw new Error('Unknown entity type');
        }

        if (entity instanceof LivingEntity) {
            entity.damage(this.getDamage());
        }

        try {
            this.onDestroy();
        } catch (e) {
            console.error(e);
        }
        this.getWorld().removeEntity(this);
    }

    /**
     * Вызывается при взаимодействие с тайлом, отличным от воздуха
     *
     * @param {WorldTile} tile
     */
    onTileInteract(tile) {
        if (!(tile instanceof WorldTile)) {
            throw new Error('Unknown entity type');
        }

        try {
            this.onDestroy();
        } catch (e) {
            console.error('Error on destroy projectile.');
        }
        this.getWorld().removeEntity(this);
    }
}