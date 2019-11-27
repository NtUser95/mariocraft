import {Entity} from "./entity.js";
import {Projectile} from "./projectile.js";
import {Direction} from "./direction.js";
import {PlayerBullet} from "./playerbullet.js";

export class LivingEntity extends Entity {
    /** @type {number} */
    #health = 20.0;
    /** @type {number} */
    #horizontalLookingDirection = Direction.RIGHT;
    /** @type {number} */
    #maxSpeed = 3;
    /** @type {number} */
    #accelerationSpeed = 1.1;

    constructor(world, x, y) {
        super(world, x, y);
    }

    update() {
        super.update();

        if (this.isOnGround() && this.isFalling() && !this.isFlying()) {
            const currentVelocity = this.getVelocity();
            if (currentVelocity.y > 0.5) {
                const bounceCoefficient = -((100 - this.getHardness()) / 100);
                currentVelocity.y = currentVelocity.y * bounceCoefficient;
            } else {
                currentVelocity.y = 0.0;
            }
            this.setVelocity(currentVelocity);
        }

        if (this.getHP() <= 0.0) {
            this.getWorld().removeEntity(this);
        }
    }

    getHP() {
        return this.#health;
    }

    setHP(hp) {
        if (hp < 0.0) {
            hp = 0.0;
        }

        this.#health = hp;
    }

    isSwimming() {
        return false;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {boolean}
     */
    isJumping() {
        return this.getVelocity().y < 0.0;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    isFalling() {
        return this.getVelocity().y > 0.0;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @return {number}
     */
    getHorizontalLookingDirection() {
        return this.#horizontalLookingDirection;
    }

    /**
     * Возвращает тайл на указанных координатах
     *
     * @param {number} direction
     */
    setHorizontalLookingDirection(direction) {
        this.#horizontalLookingDirection = direction;
    }

    /**
     *
     * @param direction
     * @return {Projectile}
     */
    spawnProjectile(direction) {
        const lookingInLeft = this.getHorizontalLookingDirection() === Direction.LEFT;
        const calcX = lookingInLeft ? this.getX() - (this.getWidth() / 2) - 3 : this.getX() + (this.getWidth() / 2) + 3;
        const velocity = lookingInLeft ? { x: -3, y: 0, } : {  x: 3, y: 0, };
        const projectile = new PlayerBullet(this.getWorld(), calcX, this.getY());console.log(projectile);
        projectile.setShooter(this);
        projectile.setVelocity(velocity);
        this.getWorld().addEntity(projectile);
        return projectile;
    }

    /**
     * @param {number} damage
     */
    damage(damage) {
        if ((this.getHP() - damage) > 0.0) {
            this.setHP(this.getHP() - damage);
        } else {
            try {
                this.onDeath();
            } catch (e) {
                console.error(e);
            }
            this.getWorld().removeEntity(this);
        }
    }

    onDeath() {
        console.log('death entity');
    }

    getMaxSpeed() {
        return this.#maxSpeed;
    }

    getAccelerationSpeed() {
        return this.#accelerationSpeed;
    }
}