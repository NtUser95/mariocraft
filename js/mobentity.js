import {LivingEntity} from "./livingentity.js";
import {Direction, getOppositeDirection} from "./direction.js";

export class MobEntity extends LivingEntity {

    #maxSpeed = 2.5;

    constructor(world, x, y) {
        super(world, x, y);
    }

    update() {
        super.update();

        if (!this.getHorizontalLookingDirection()) {
            this.setHorizontalLookingDirection(Direction.LEFT)
        }

        const lookingDirection = this.getHorizontalLookingDirection();
        const movX = lookingDirection === Direction.RIGHT ? this.getAccelerationSpeed() : -(this.getAccelerationSpeed());
        const calcMovX = this.getVelocity().x + movX;
        if (this.canMoveInDirection({x: calcMovX, y: this.getVelocity().y})) {
            if (calcMovX >= 0 && calcMovX <= this.getMaxSpeed()) {
                this.addVelocity({x: movX, y: 0});
            } else if (calcMovX < 0 && calcMovX >= -this.getMaxSpeed()) {
                this.addVelocity({x: movX, y: 0});
            }
        } else {console.log('switch move direction' + getOppositeDirection(lookingDirection));
            this.setVelocity({x: 0, y: this.getVelocity().y});
            this.setHorizontalLookingDirection(getOppositeDirection(lookingDirection))
        }
    }
}