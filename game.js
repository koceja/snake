var canvas;
var ctx;


window.onload = () => {
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    document.addEventListener("keydown", getInput);
    init();
    setInterval(game, 1000/12)
};

var rows;
var cols;

var x;
var y;

var inputQueue;

var xv;
var yv;

var apple;

var trail;
var size;
var visibleSize;

function init() {
    rows = 20;
    cols = 20;

    x = 4;
    y = 4;

    xv = 0;
    yv = 0;


    trail = [null, null, null, null];

    generateNewApple();

    inputQueue = [];
    size = 5;
    visibleSize = 1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "18px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText("Use the arrow keys to start...", 20, 200);

    document.getElementById("size").innerHTML = size;

}

function game() {

    if (inputQueue.length > 0) {
        keypress();
    }

    if (xv == 0 && yv == 0) {
        return;
    }

    if (trail.length == rows*cols) {
        endGame();
    }

    document.getElementById("size").innerHTML = size;

    if (xv != 0 || yv != 0) {
        if (visibleSize < size) {
            visibleSize++;
        }
        trail.push({x: x, y: y});
    
        if (trail.length >= size) {
            trail.shift();
        }
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x += xv;
    if (x < 0) {
        x = rows - 1;
    } else if (x >= rows) {
        x = 0;
    }

    y += yv;
    if (y < 0) {
        y = cols - 1;
    } else if (y >= cols) {
        y = 0;
    }

    for (var i = 0; i < trail.length; i++) {
        if (trail[i] != null) {
            if (trail[i].x == x && trail[i].y == y) {
                reset();
                return;
            }
        }
    }

    if (x == apple.x && y == apple.y) {
        size++;
        generateNewApple();
        document.getElementById("size").innerHTML = size;
    }

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x*20, apple.y*20, 19, 19);

    ctx.fillStyle = "lime";
    ctx.fillRect(x*20, y*20, 19, 19);

    for (var i = 0; i < trail.length; i++) {
        if (trail[i] == null) {
            continue;
        }
        ctx.fillRect(trail[i].x*20, trail[i].y*20, 19, 19);

    }

    
}

function reset() {

    size = 5;
    visibleSize = 1;
    x = 4;
    y= 4;
    trail = [null, null, null, null]
    xv = 0;
    yv = 0;
    generateNewApple();

    ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "18px Courier New";
        ctx.fillStyle = "white";
        ctx.fillText("You ran into yourself.", 20, 180);
        ctx.fillText("Use the arrow keys to restart...", 20, 200);

}

function endGame() {
    size = 5;
    visibleSize = 1;
    x = 4;
    y= 4;
    trail = [null, null, null, null]
    xv = 0;
    yv = 0;
    generateNewApple();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "18px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText("You have won the game!", 20, 180);
    ctx.fillText("Use the arrow keys to restart...", 20, 200);

}

function getInput(e) {
    inputQueue.push(e);
}

function keypress() {
    var e = inputQueue[0];
    inputQueue.shift();
    switch (e.keyCode) {
        case 37:
            if (xv != 1 || yv != 0) {
                xv = -1;
                yv = 0;
            }
            break;
        case 38:
            if (xv != 0 || yv != 1) {
                xv = 0;
                yv = -1;
            }
            break;
        case 39:
            if (xv != -1 || yv != 0) {
                xv = 1;
                yv = 0;
            }
            break;
        case 40:
            if (xv != 0 || yv != -1) {
                xv = 0;
                yv = 1;
            }
            break;
    }
}

function generateNewApple() {
    if (trail.length == rows*cols) {
        endGame();
    }
    var taken = new Set();
    for (var i = 0; i < trail.length; i++) {
        if (trail[i] != null) {
            const index = trail[i].y * rows + trail[i].x;
            taken.add(index);
        }
    }
    var open = [];
    for (var i = 0; i < rows * cols; i++) {
        if (!taken.has(i)) {
            open.push(i);
        }
    }

    var index = open[Math.floor(Math.random() * open.length)];
    var ax = index % rows;
    var ay = Math.floor(index / rows);
    
    apple = {x: ax,
        y: ay}
}