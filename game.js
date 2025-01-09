const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const playerImg = new Image();
playerImg.src = 'assets/images/ship.png';

const player = {
    x: canvas.width / 2 - 25, // Start in the middle of the screen
    y: canvas.height - 80, // Start at the bottom of the screen
    width: 50,
    height: 60,
    speed : 5 // Speed of the player
};

const keys = {}; // Object to store the keys pressed
const bullets = [];
const bulletSpeed = 5;
let canShoot = true; // Variable to control the shooting rate
const shootRate = 250; // Time between shots in milliseconds

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;  // Change the value to true when the key is pressed

    if (event.key === ' ' && canShoot) {
        shootBullet();
        canShoot = false;
        setTimeout(() => {
            canShoot = true;
        }, shootRate);
    }
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false; // Change the value to false when the key is released
});

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5, // Center the bullet
        y: player.y,
        width: 5,
        height: 10,
        speed: bulletSpeed // Speed of the bullet
    });
}

function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (!bullets[i]) continue; // Skip the loop if the bullet was removed
        bullets[i].y -= bullets[i].speed;

        for (let j = asteroids.length - 1; j >= 0; j--) { // Loop through the asteroids backwards
            if (checkCollision(bullets[i], asteroids[j])) {
                if (!bullets[i]) continue; // Skip the loop if the bullet was removed
                
                explode(asteroids[j].x + asteroids[j].width / 2, asteroids[j].y + asteroids[j].height / 2);

                asteroids.splice(j, 1); // Remove the asteroid

                if (bullets[i] && bullets[i].y > 0) {
                    bullets.splice(i, 1); // Remove the bullet
                }
                break; // Break the loop to prevent checking for collisions with other asteroids
            }
        }
        if (bullets[i] && bullets[i].y < 0) {
            bullets.splice(i, 1); // Remove the bullet if it goes off screen
        }
    }
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

const asteroidImg = new Image();
asteroidImg.src = 'assets/images/asteroid.png';

const asteroids = [];
const spawnRate = 1000; // Time between asteroid spawns in milliseconds

function spawnAsteroid() {
    if (isGameOver) return;

    asteroids.push({
        x: Math.random() * (canvas.width - 50), // Random x position
        y: -50, // Start above the screen
        width: 50,
        height: 50,
        speed: Math.random() * 2 + 1, // Speed of the asteroid
        rotate: Math.random() * 360 // Rotation of the asteroid
    });
}

function moveAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].y += asteroids[i].speed;
        asteroids[i].rotate += 1;

        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1); // Remove the asteroid if it goes off screen
        }
    }
}
function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.save();
        const centerX = asteroid.x + asteroid.width / 2;
        const centerY = asteroid.y + asteroid.height / 2;
        ctx.translate(centerX, centerY); // Move the canvas origin to the center of the asteroid

        ctx.rotate(asteroid.rotate * Math.PI / 180); // Rotate the asteroid

        ctx.drawImage(asteroidImg, -asteroid.width / 2, -asteroid.height / 2, asteroid.width, asteroid.height); // Center the asteroid
        ctx.restore(); // Restore the canvas to the original state
    });
}

setInterval(spawnAsteroid, spawnRate);

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

const explosionImg = new Image();
explosionImg.src = 'assets/images/explosion.png';

const explosions = [];

function explode(x, y) {
    explosions.push({
        x: x - 25, // Center the explosion
        y: y - 25, // Center the explosion
        width: 50,
        height: 50,
        timer: 30 // Time the explosion will last

    });
}

function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i]) continue; // Skip the loop if the explosion was removed
        ctx.drawImage(explosionImg, explosions[i].x, explosions[i].y, explosions[i].width, explosions[i].height);
        explosions[i].timer--;

        if (explosions[i].timer <= 0) {
            explosions.splice(i, 1); // Remove the explosion
        }
    }
}

function checkPlayerCollision() {
    for (let i = 0; i < asteroids.length; i++) {
        if (checkCollision(player, asteroids[i])) {
            explode(player.x + player.width / 2, player.y + player.height / 2);
            gameOver();
            return true;
        }
    }
    return false;
}

let isGameOver = false;

function gameOver() {
    isGameOver = true;
    ctx.fillStyle = 'orange';
    ctx.font = '48px VT323, cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    setTimeout(() => {
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.style.position = 'absolute';
        restartButton.style.left = "50%";
        restartButton.style.top = "60%";
        restartButton.style.transform = "translate(-50%, -50%)";
        restartButton.style.padding = "10px 20px";
        restartButton.style.fontSize = "24px";
        document.body.appendChild(restartButton);
        restartButton.focus();

        restartButton.addEventListener('click', () => {
            location.reload();
        });
    }, 1000);
}

function gameLoop() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '48px VT323, cursive';
    
    movePlayer(); // Move the player
    moveBullets(); // Move the bullets
    moveAsteroids(); // Move the asteroids
    checkPlayerCollision(); // Check for player collision

    if (keys[' '] && canShoot) {
        shootBullet();
        canShoot = false;
        setTimeout(() => {
            canShoot = true;
        }, shootRate);
    }

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    drawBullets(); // Create the bullets
    drawAsteroids(); // Create the asteroids
    drawExplosions(); // Create the explosions

    requestAnimationFrame(gameLoop);
}

playerImg.onload = () => {
    gameLoop();
}