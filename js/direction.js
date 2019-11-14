/**
 *
 * @type {{DOWN: number, LEFT: number, RIGHT: number, UP: number}}
 */
export const Direction = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};

/**
 *
 *
 * @param direction
 * @returns {number}
 */
export function getOppositeDirection(direction) {
    switch (direction) {
        case Direction.UP:
            return Direction.DOWN;
        case Direction.DOWN:
            return Direction.UP;
        case Direction.LEFT:
            return Direction.RIGHT;
        case Direction.RIGHT:
            return Direction.LEFT;
        default:
            throw new Error('Undefined direction');
    }
}