function distancia(state) {
    const goalState = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    let distance = 0;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] !== 0) {
                const x = Math.floor((state[i][j] - 1) / 3);
                const y = (state[i][j] - 1) % 3;
                distance += Math.abs(x - i) + Math.abs(y - j);
            }
        }
    }
    
    return distance;
}

function PosiblesMovimientos(state) {
    const moves = [];
    let x, y;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === 0) {
                x = i;
                y = j;
                break;
            }
        }
        if (x !== undefined && y !== undefined) break;
    }
    
    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0];
    
    for (let d = 0; d < 4; d++) {
        const nx = x + dx[d];
        const ny = y + dy[d];
        
        if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) {
            const newState = JSON.parse(JSON.stringify(state));
            newState[x][y] = newState[nx][ny];
            newState[nx][ny] = 0;
            moves.push(newState);
        }
    }
    
    return moves;
}

function Grafo(initialState) {
    const heap = [[distancia(initialState), 0, initialState, []]];
    const visited = new Set();
    
    while (heap.length > 0) {
        heap.sort((a, b) => a[0] - b[0]);
        const [_, cost, state, path] = heap.shift();
        
        if (JSON.stringify(state) === JSON.stringify([[1, 2, 3], [4, 5, 6], [7, 8, 0]])) {
            return path;
        }
        
        visited.add(JSON.stringify(state));
        
        const possibleMoves = PosiblesMovimientos(state);
        for (const nextState of possibleMoves) {
            if (!visited.has(JSON.stringify(nextState))) {
                const nextCost = cost + 1;
                const priority = nextCost + distancia(nextState);
                heap.push([priority, nextCost, nextState, path.concat([nextState])]);
            }
        }
    }
}

function printState(state) {
    for (let i = 0; i < 3; i++) {
        console.log(state[i].join(' '));
    }
    console.log('');
}

function getAction(prevState, nextState) {
    let prevX, prevY, nextX, nextY;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (prevState[i][j] === 0) {
                prevX = i;
                prevY = j;
            }
            if (nextState[i][j] === 0) {
                nextX = i;
                nextY = j;
            }
        }
    }

    if (nextX > prevX) return 'Abajo';
    if (nextX < prevX) return 'Arriba';
    if (nextY > prevY) return 'Derecha';
    if (nextY < prevY) return 'Izquierda';
}

const initialState = [[7, 2, 4], [5, 0, 6], [8, 3, 1]];
const solution = Grafo(initialState);

solution.forEach((state, index) => {
    if (index > 0) {
        console.log(`--- Movimiento ${index} (${getAction(solution[index-1], state)}) ---`);
    } else {
        console.log(`--- Estado Inicial ---`);
    }
    printState(state);
});

console.log("--- Estado Final ---");
printState([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
