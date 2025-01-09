const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width / 2 - 25, canvas.height - 60, 50, 50);

    requestAnimationFrame(gameLoop);
}

gameLoop();