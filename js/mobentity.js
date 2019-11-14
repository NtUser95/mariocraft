import {LivingEntity} from "./livingentity.js";
import {Direction, getOppositeDirection} from "./direction.js";

export class MobEntity extends LivingEntity {

    constructor(world, x, y) {
        super(world, x, y);
    }

    update() {
        super.update();

        if (!this.getHorizontalLookingDirection()) {
            this.setHorizontalLookingDirection(Direction.LEFT)
        }

        const lookingDirection = this.getHorizontalLookingDirection();
        if (this.canMoveInDirection(lookingDirection)) {
            const movX = lookingDirection === Direction.RIGHT ? 2 : -2;
            this.setX(this.getX() + movX);
        } else {console.log('switch move direction' + getOppositeDirection(lookingDirection));
            this.setHorizontalLookingDirection(getOppositeDirection(lookingDirection))
        }
    }
}