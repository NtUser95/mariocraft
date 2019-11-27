import {Direction} from "./direction.js";
import {TileType} from "./worldtile.js";

export class Entity {
    /** @type {number} */
    #positionX = 0.0;
    /** @type {number} */
    #positionY = 0.0;
    /** @type {number} */
    #velocityX = 0.0;
    /** @type {number} */
    #velocityY = 0.0;
    /** @type {number} */
    #height = 0.0;
    /** @type {number} */
    #width = 0.0;
    /** @type {World} */
    #world;
    /** @type {number} */
    #hardness = 50.0;
    /** @type {boolean} */
    #flying = false;

    constructor(world, x, y) {
        this.#positionX = x;
        this.#positionY = y;
        this.#world = world;
    }

    update() {
        if(!this.isOnGround() && !this.isFlying()) { // gravity
            const currentVelocity = this.getVelocity();
            if (currentVelocity.y < this.getWorld().getMaximumSpeedOfFreeFall()) {
                currentVelocity.y += this.getWorld().getGravity();
                this.setVelocity(currentVelocity);
            }
        }

        if (this.#velocityY !== 0.0) {
            this.#positionY += this.#velocityY;
        }
        if (this.#velocityX !== 0.0) {
            this.#positionX += this.#velocityX;
        }
        if (this.#positionY > window.screen.availHeight + 100) {
            this.getWorld().removeEntity(this);
            console.log('Entity reached end of world. Removing...');
        }
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    getX() {
        return this.#positionX;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    getY() {
        return this.#positionY;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} x
     */
    setX(x) {
        this.#positionX = x;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} y
     */
    setY(y) {
        this.#positionY = y;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {Entity} entity
     */
    isIntersectsWith(entity) {
        if(!(entity instanceof Entity)) {
            throw new Error('Invalid entity type');
        }
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {Object} velocity
     */
    setVelocity(velocity) {
        this.#velocityX = velocity.x;
        this.#velocityY = velocity.y;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {Object} velocity
     */
    addVelocity(velocity) {
        this.#velocityX += velocity.x;
        this.#velocityY += velocity.y;
    }

    multipleVelocity(velocity) {
        this.#velocityX *= velocity.x;
        this.#velocityY *= velocity.y;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {Object}
     */
    getVelocity() {
        return {
            x: this.#velocityX,
            y: this.#velocityY,
        };
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    getHeight() {
        return this.#height;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    getWidth() {
        return this.#width;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} pixels
     */
    setHeight(pixels) {
        this.#height = pixels;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} pixels
     */
    setWidth(pixels) {
        this.#width = pixels;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {World}
     */
    getWorld() {
        return this.#world;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    getHardness() {
        return this.#hardness < 100.0 && this.#hardness >= 0.0 ? this.#hardness : 100.0;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} h
     */
    setHardness(h) {
        this.#hardness = h;
    }

    /**
     * Возвращает Y координату под ногами
     *
     * @return {number}
     */
    getPositionAtFeet() {
        return this.getY() + /*(this.getHeight()) +*/ 1;
    }

    /**
     * Возвращает Y координату под ногами
     *
     * @return {number}
     */
    getPositionAtHead() {
        return this.getY() - (this.getHeight() / 2) - 1;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {boolean}
     */
    canMoveInDirection(velocity) {console.log(velocity);
    const direction = velocity.x >= 0 ? Direction.RIGHT : Direction.LEFT;
        return !this.getCollisionWithEntities(velocity).length && this.getCollisionWithTileInDirection(direction).getType() !== TileType.TEXTURE;
    }

    getCollisionWithTileInDirection(direction) {
        switch(direction) {
            case Direction.DOWN:
                return this.getWorld().getTileAt(this.#positionX, this.getPositionAtFeet());
            case Direction.UP:
                return this.getWorld().getTileAt(this.#positionX, this.getPositionAtHead());
            case Direction.LEFT:
                const movLeftX = (this.getWidth() / 2) - this.getX() + 1;
                return this.getWorld().getTileAt(movLeftX, this.getY());
            case Direction.RIGHT:
                const movX = (this.getWidth() / 2) + this.getX() - 1;
                return this.getWorld().getTileAt(movX, this.getY());
            default:
                throw new Error('Unknown direction');
        }
    }

    /**
     *
     * @param {Object} velocity
     * @return Entity[]
     */
    getCollisionWithEntities(velocity) {
        const entities = [];
        const bodyRadius = (this.getHeight() / 2) + 1;
        for(const entity of this.getWorld().getNearbyEntities(this.getX(), this.getY(), bodyRadius)) {
            if (entity === this) {
                continue;
            }

            const diffCentersX = Math.abs((this.getX() + velocity.x) - entity.getX());console.log(`(${this.getX()} + ${velocity.x}) - ${entity.getX()}`);
            const diffCentersY = Math.abs((this.getY() + velocity.y) - entity.getY());
            const bodiesHeightTotal = Math.abs((this.getHeight() / 2) + (entity.getHeight() / 2));
            const bodiesWidthTotal = Math.abs((this.getWidth() / 2) + (entity.getWidth() / 2));
            if (diffCentersY <= (bodiesHeightTotal / 2) && diffCentersX <= (bodiesWidthTotal / 2)) {
                entities.push(entity);
            }
        }

        return entities;
    }

    /**
     *
     * @returns {boolean}
     */
    isFlying() {
        return this.#flying;
    }

    /**
     *
     * @param {boolean} trueOrFalse
     */
    setFlying(trueOrFalse) {
        this.#flying = trueOrFalse;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {boolean}
     * @TODO: Bug: Отсчитывается от центра, из-за этого возможно боками залезать в текстуры на спуске
     */
    isOnGround() {
        const YCoord = this.getPositionAtFeet();
        const x1Coord = this.getX() - (this.getWidth() / 2);
        const x2Coord = this.getX() + (this.getWidth() / 2);
        const tile1AtFeet = this.getWorld().getTileAt(x1Coord, YCoord);
        const tile2AtFeet = this.getWorld().getTileAt(x2Coord, YCoord);
        return tile1AtFeet.getType() === TileType.TEXTURE || tile2AtFeet.getType() === TileType.TEXTURE;
    }
}