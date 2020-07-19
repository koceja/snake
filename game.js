var canvas;
var ctx;


var leaderboard = [null, null, null, null, null, null, null, null, null, null];

function setCookie() {

    var cookie = ""
    for (var i = 0; i < leaderboard.length; i++) {
            cookie += i + "=" + leaderboard[i] + ";"
    }
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();

    document.cookie = cookie + expires;
  }

function readCookie() {
    var allcookies = document.cookie;
    if (allcookies.length === 0) {
        return;
    }
    // Get all the cookies pairs in an array
    cookiearray = allcookies.split(';');
               
               // Now take key value pair out of this array
               for(var i = 0; i < cookiearray.length - 1; i++) {
                  number = cookiearray[i].split('=')[0].parseInt();
                  score = cookiearray[i].split('=')[1].parseInt();
                  leaderboard[number] = score;
               }
}


window.onload = () => {
    readCookie();
    initLeaderboard();
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    document.addEventListener("keydown", getInput);
    init();
    setInterval(game, 1000/12)
};


function initLeaderboard() {
    var inner = "";
    for (var i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i] === null) {
            break;
        }
        inner += "<li class='list-group-item'>" + leaderboard[i] + "</li>";
    }
    $(".list-group").html(inner);
}

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

    x = 10;
    y = 10;

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
        wallLose();
        return;
    } else if (x >= rows) {
        wallLose();
        return;
    }

    y += yv;
    if (y < 0) {
        wallLose();
        return;
    } else if (y >= cols) {
        wallLose();
        return;
    }

    for (var i = 0; i < trail.length; i++) {
        if (trail[i] != null) {
            if (trail[i].x == x && trail[i].y == y) {
                trailLose();
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

function wallLose() {

}

function wallLose() {
    reset();
    ctx.font = "18px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText("You ran into a wall.", 20, 180);
    ctx.fillText("Use the arrow keys to restart...", 20, 200);
}

function trailLose() {
    reset();
    ctx.font = "18px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText("You ran into yourself.", 20, 180);
    ctx.fillText("Use the arrow keys to restart...", 20, 200);
}

function reset() {
    for (var i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i] < size) {
            var temp = leaderboard[i];
            leaderboard[i] = size;
            for (var j = i + 1; j < leaderboard.length; j++) {
                var temp2 = leaderboard[j]
                leaderboard[j] = temp;
                temp = temp2;
            }
            break;
        }
    }
    initLeaderboard();
    setCookie();
    size = 5;
    visibleSize = 1;
    x = 10;
    y= 10;
    trail = [null, null, null, null]
    xv = 0;
    yv = 0;
    generateNewApple();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

        

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
    e.preventDefault();
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