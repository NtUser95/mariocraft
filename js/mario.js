import {WorldBuilder} from "./worldbuilder.js";
import {Player} from "./player.js";
import {Direction} from "./direction.js";
import {MobEntity} from "./mobentity.js";
import {Projectile} from "./projectile.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let paused = false;
const tileSize = 50;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key === "ArrowRight" || e.key === "d") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = true;
    } else if (e.key === "ArrowUp"  || e.key === "w") {
        upPressed = true;
    } else if (e.key === "ArrowDown" || e.key === "s") {
        downPressed = true;
    } else if(e.key === "p") {
        paused = !paused;
    } else if (e.key === "Shift") {
        player.setVelocity({
            x: 0.0,
            y: 0.0,
        });
        player.setFlying(!player.isFlying());
    } else if (e.code === "Space") {console.log('projectile launch');
        player.spawnProjectile(player.getHorizontalLookingDirection())
    }
}

function keyUpHandler(e) {
    if(e.key === "ArrowRight" || e.key === "d") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = false;
    } else if (e.key === "ArrowUp"  || e.key === "w" || e.key === "Space") {
        upPressed = false;
    } else if (e.key === "ArrowDown" || e.key === "s") {
        downPressed = false;
    }
}

myCanvas.width = window.screen.availWidth;
myCanvas.height = window.screen.availHeight - 110;
let world;
let player;

WorldBuilder.createFromFile('testlevel').then((w) => {
    world = w;console.log('load level');
    player = new Player(world, 150, 300);
    player.setHeight(30);
    player.setWidth(30);
    world.addEntity(player);

    const mob = new MobEntity(world, 850, 300);
    mob.setHeight(30);
    mob.setWidth(30);
    world.addEntity(mob);

    /*const mob2 = new MobEntity(world, 380, 300);
    mob2.setHeight(30);
    mob2.setWidth(30);
    world.addEntity(mob2);*/

    const mob4 = new MobEntity(world, 440, 300);
    mob4.setHeight(30);
    mob4.setWidth(30);
    world.addEntity(mob4);
});

function drawGraphics() {
    if (!world || paused) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const worldTiles = world.getTiles();
    for (const tileId in worldTiles) {
        const tile = worldTiles[tileId];
        ctx.beginPath();
        ctx.rect(tile.getX() * tileSize, tile.getY() * tileSize, tileSize, tileSize);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    const worldEntities = world.getEntities();
    for (const entity of worldEntities) {
        ctx.beginPath();
        const calcHeight = entity.getHeight() / 2;
        const calcWidth = entity.getWidth() / 2;
        ctx.rect(entity.getX() - calcWidth, entity.getY() - calcHeight, calcWidth, calcHeight);
        if (entity instanceof Projectile) {
            ctx.fillStyle = "#b600dd";
        } else {
            ctx.fillStyle = "#dd0019";
        }
        ctx.fill();
        ctx.closePath();
    }

    ctx.fillStyle = "#dd1e00";
    ctx.fillText(`position X:${player.getX()}|Y:${player.getY()}`, 50, 50 );
    ctx.fillText(`velocity:${player.getVelocity().x}/${player.getVelocity().y}`, 50, 70 );
    ctx.fillText(`isJumping:${player.isJumping()} isFalling:${player.isFalling()} isOnGround:${player.isOnGround()} isFlying:${player.isFlying()}`, 50, 90 );
    ctx.fillText(`Direction :${player.getHorizontalLookingDirection()}`, 50, 110 );
    ctx.fillText(`Entities :${player.getWorld().getEntities().length}`, 50, 130 );
}

function handlePlayerInput() {
    if (!player || paused) {
        return;
    }

    if (leftPressed && player.canMoveInDirection(Direction.LEFT)) {
        player.setX(player.getX() - 1);
        player.setHorizontalLookingDirection(Direction.LEFT);
    }
    if (rightPressed && player.canMoveInDirection(Direction.RIGHT)) {
        player.setX(player.getX() + 1);
        player.setHorizontalLookingDirection(Direction.RIGHT);
    }
    if (upPressed && !player.isFlying() && player.isOnGround() && !player.isJumping() && player.canMoveInDirection(Direction.UP)) {
        player.addVelocity({
            x: 0.0,
            y: -8.0,
        });
    }
    if (upPressed && player.isFlying()) {
        player.setY(player.getY() - 1);
    }
    if (downPressed && (player.isFlying() || player.isSwimming() && player.canMoveInDirection(Direction.DOWN))) {
        player.setY(player.getY() + 1);
    }
}

function updateWorlds() {
    if (!world || paused) {
        return;
    }
    world.update();
}

setInterval(handlePlayerInput, 1000 / 60);
setInterval(updateWorlds, 1000 / 30);
setInterval(drawGraphics, 1000 / 60);