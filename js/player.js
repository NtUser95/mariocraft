import {LivingEntity} from "./livingentity.js";
import {Direction} from "./direction.js";

export class Player extends LivingEntity {
    constructor(world, x, y) {
        super(world, x, y);
    }

    update() {
        super.update();

        /*const entitiesInDirection = this.getCollisionWithEntityInDirection(Direction.DOWN);
        if (entitiesInDirection.length) {
            this.addVelocity({
                x: this.getVelocity().x,
                y: -10,
            });
            for (const entity of entitiesInDirection) {
                entity.getWorld().removeEntity(entity);
            }
        }*/
    }
}