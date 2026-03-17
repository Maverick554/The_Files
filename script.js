const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('os-timer');

let gameState = "BOOT";
let frame = 0;
let intensity = 0;

// --- INITIALIZE ---
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', init);
init();

// --- INPUT (PC & IPHONE) ---
const handleInput = () => {
    if (gameState === "BOOT") gameState = "STORY";
    else if (gameState === "STORY") gameState = "MINIGAME";
    else if (gameState === "MINIGAME") {
        intensity = 30; // Shake the screen
        gameState = "VOID";
    }
};

canvas.addEventListener('pointerdown', handleInput);

// --- RENDER LOOP ---
function loop() {
    frame++;
    
    // Smooth Timer Update
    let seconds = Math.floor(frame / 60);
    timerDisplay.innerText = `00:08:${seconds < 10 ? '0'+seconds : seconds}`;

    // Clear Screen
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Camera Shake Logic
    let shakeX = (Math.random() - 0.5) * intensity;
    let shakeY = (Math.random() - 0.5) * intensity;
    if (intensity > 0) intensity *= 0.9;

    ctx.save();
    ctx.translate(shakeX, shakeY);

    if (gameState === "BOOT") {
        ctx.fillStyle = "#00ff41";
        ctx.font = "20px Courier New";
        ctx.fillText(">> SYSTEM_RECOVERY_INIT...", 50, 100);
        ctx.fillText(">> [TAP TO BEGIN CALIBRATION]", 50, 140);
    }

    if (gameState === "STORY") {
        ctx.fillStyle = "white";
        ctx.font = "16px Courier New";
        // SAD INTENSE LORE:
        ctx.fillText("ID: SUBJECT_7_ELARA", 50, 80);
        ctx.fillText("LOG: 'The water was too cold. They didn't hear me.'", 50, 120);
        ctx.fillStyle = "red";
        if (frame % 60 < 30) ctx.fillText("ERROR: SHE IS STILL RECORDING", 50, 160);
    }

    if (gameState === "MINIGAME") {
        // SCARY MINI-GAME: Follow the dot (or it follows you)
        ctx.strokeStyle = "white";
        ctx.strokeRect(canvas.width/2 - 50, canvas.height/2 - 50, 100, 100);
        ctx.fillText("KEEP CENTERED", canvas.width/2 - 60, canvas.height/2 - 70);
        
        let targetX = canvas.width/2 + Math.sin(frame * 0.05) * 100;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(targetX, canvas.height/2, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    if (gameState === "VOID") {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "30px Courier New";
        ctx.fillText("YOU AREN'T PLAYING A GAME.", canvas.width/2, canvas.height/2);
        
        // EASTER EGG: Screen turns blood red slowly
        document.body.style.backgroundColor = `rgb(${intensity * 5}, 0, 0)`;
    }

    ctx.restore();
    requestAnimationFrame(loop);
}

loop();
