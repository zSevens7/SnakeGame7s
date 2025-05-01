document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("gameBoard");
    const startButton = document.getElementById("startGame");
    const pauseButton = document.getElementById("pauseGame");

    // Estado inicial da cobra
    let snake = [
        { x: 200, y: 200, dir: "right" }, // Cabeça
        { x: 160, y: 200, dir: "right" }, // Corpo
        { x: 120, y: 200, dir: "right" }  // Cauda
    ];

    let direction = { x: 40, y: 0 };
    let apple = { x: 400, y: 200 };
    let mouse = getRandomPosition();
    let gameInterval = null;
    let isPaused = false;

    // Função adicionada para resolver o erro
    function getDirectionKey() {
        if (direction.x > 0) return "right";
        if (direction.x < 0) return "left";
        if (direction.y > 0) return "down";
        if (direction.y < 0) return "up";
        return "right";
    }

    function drawGame() {
        board.innerHTML = "";

        // Desenha cabeça
        drawElement(snake[0], "SNAKEHEAD");

        // Desenha corpo
        for(let i = 1; i < snake.length - 1; i++) {
            const prevDir = snake[i-1].dir;
            const nextDir = snake[i+1].dir;
            drawElement(snake[i], getBodyImage(prevDir, nextDir));
        }

        // Desenha cauda
        drawElement(snake[snake.length-1], "SNAKETAIL");

        // Itens
        drawElement(apple, "APPLE");
        drawElement(mouse, "MOUSE");
    }

    function getBodyImage(prevDir, nextDir) {
        if((prevDir === "right" && nextDir === "down") || (prevDir === "up" && nextDir === "left")) return "SNAKEXDOWN";
        if((prevDir === "right" && nextDir === "up") || (prevDir === "down" && nextDir === "left")) return "SNAKEXUP";
        if((prevDir === "left" && nextDir === "down") || (prevDir === "up" && nextDir === "right")) return "SNAKEXDOWN";
        if((prevDir === "left" && nextDir === "up") || (prevDir === "down" && nextDir === "right")) return "SNAKEXUP";
        return "SNAKEBODY";
    }

    function moveSnake() {
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y,
            dir: getDirectionKey() // Chamada corrigida
        };

        // Verifica colisões
        if(newHead.x < 0 || newHead.x >= 560 || newHead.y < 0 || newHead.y >= 400) {
            gameOver();
            return;
        }

        if(snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
            gameOver();
            return;
        }

        snake.unshift(newHead);
        snake.pop();

        // Atualiza direções do corpo
        for(let i = 1; i < snake.length; i++) {
            snake[i].dir = snake[i-1].dir;
        }

        // Lógica de comida
        if(newHead.x === apple.x && newHead.y === apple.y) {
            apple = getRandomPosition();
            snake.push({...snake[snake.length-1]});
        }
        else if(newHead.x === mouse.x && newHead.y === mouse.y) {
            mouse = getRandomPosition();
            snake.push({...snake[snake.length-1]});
            snake.push({...snake[snake.length-1]});
        }

        drawGame();
    }

    function drawElement(pos, img) {
        const element = document.createElement("div");
        element.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            width: 40px;
            height: 40px;
            background-image: url('SPRITES/${img}.png');
            background-size: cover;
            transform: ${getRotation(pos.dir)};
        `;
        board.appendChild(element);
    }

    function getRotation(dir) {
        return {
            up: "rotate(-90deg)",
            down: "rotate(90deg)",
            left: "rotate(180deg)",
            right: "rotate(0deg)"
        }[dir];
    }

    function getRandomPosition() {
        let newPos;
        do {
            newPos = {
                x: Math.floor(Math.random() * 14) * 40,
                y: Math.floor(Math.random() * 10) * 40
            };
        } while(snake.some(part => part.x === newPos.x && part.y === newPos.y));
        return newPos;
    }

    function gameOver() {
        alert("Game Over!");
        resetGame();
    }

    function resetGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        snake = [
            { x: 200, y: 200, dir: "right" },
            { x: 160, y: 200, dir: "right" },
            { x: 120, y: 200, dir: "right" }
        ];
        direction = { x: 40, y: 0 };
        apple = { x: 400, y: 200 };
        mouse = getRandomPosition();
        drawGame();
    }

    // Controles
    document.addEventListener("keydown", (e) => {
        const keys = {
            ArrowUp: {x:0,y:-40}, ArrowDown:{x:0,y:40},
            ArrowLeft:{x:-40,y:0}, ArrowRight:{x:40,y:0},
            w:{x:0,y:-40}, s:{x:0,y:40}, a:{x:-40,y:0}, d:{x:40,y:0}
        };
        if(keys[e.key]) direction = keys[e.key];
    });

    startButton.addEventListener("click", () => {
        if(!gameInterval) gameInterval = setInterval(moveSnake, 200);
    });

    pauseButton.addEventListener("click", () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? "Continuar" : "Pausar";
        if(!isPaused) gameInterval = setInterval(moveSnake, 200);
        else clearInterval(gameInterval);
    });

    drawGame();
});