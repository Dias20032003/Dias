const map = [
        "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
        "W                            W",
        "W                            W",
        "W                            W",
        "W                            W",
        "W                            W",
        "W                            W",
        "W                            W",
        "W                            F",
        "W S                          W",
        "W                            W",
        "W                            W",
        "W                            W",
        "W                            W",
        "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    ],
    maze = document.getElementById("maze"),
    restartBtn = document.getElementById('restart-btn'),
    blockSize = 10;


document.getElementById('warning')
    .addEventListener('click', function() { this.style.display = 'none'; });



let wallBumpTimer;


setupEventListeners();
startGame();

function startGame() {
    const classMap = { 'W': 'wall', 'S': 'start', 'F': 'finish' };

    maze.innerHTML = '';

    playerElem = document.createElement('div');
    playerElem.className = 'player';
    maze.appendChild(playerElem);

    map.forEach((rowString, y) => {
        const row = document.createElement('div');
        row.className = 'row';
        maze.appendChild(row);

        rowString.split('').forEach((blockType, x) => {
            const block = document.createElement('div');
            block.className = `block ${classMap[blockType] || ''}`;
            row.appendChild(block);

            if (blockType === 'S') { setPlayerPos(x, y); } else if (blockType === 'F') { finishPos = { x, y }; }
        });
    });
}

function setupEventListeners() {

    addEventListener('keydown', e => {
        const { x, y } = playerPos;

        switch (e.keyCode) {
            case 37:
                moveTo(x - 1, y);
                break; // Слева
            case 38:
                moveTo(x, y - 1);
                break; // Вверх
            case 39:
                moveTo(x + 1, y);
                break; // Направа
            case 40:
                moveTo(x, y + 1);
                break; // Вниз
        }

        if ([37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
    });

    restartBtn.addEventListener('click', startGame);
}

function setPlayerPos(x, y) {

    playerPos = { x, y };

    playerElem.style.left = x * blockSize + 'px';
    playerElem.style.top = y * blockSize + 'px';

    checkIfWin();
}

function checkIfWin() {

    if (playerPos.x === finishPos.x && playerPos.y === finishPos.y) {

        setTimeout(() => {
            alert("Поздравляю ты свободен!");
        }, 200);
    }
}

function getBlockByPosition(x, y) {

    return document.querySelector(`.row:nth-child(${y+1}) .block:nth-child(${x+1})`);
}

function getBlockTypeByPosition(x, y) {

    return map[y].charAt(x);
}

function moveTo(x, y) {
    // Check if we are within the maze and not on a wall
    const isMoveAllowed = (
        x >= 0 && x < map[0].length &&
        y >= 0 && y < map.length &&
        getBlockTypeByPosition(x, y) !== 'W'
    );
    if (isMoveAllowed) { setPlayerPos(x, y); } else { bumpIntoWall(x, y); }
}

function bumpIntoWall(nextX, nextY) {
    const { x, y } = playerPos;

    const direction = (nextX < x && 'left') ||
        (nextY < y && 'up') ||
        (nextX > x && 'right') ||
        'down';
    clearBumpAnimation();

    playerElem.classList.add(`bump-${direction}`);
    maze.classList.add('red');
    wallBumpTimer = setTimeout(clearBumpAnimation, 200);
}

function clearBumpAnimation() {
    clearTimeout(wallBumpTimer);
    playerElem.classList.remove('bump-left', 'bump-up', 'bump-right', 'bump-down');
    maze.classList.remove('red');
}