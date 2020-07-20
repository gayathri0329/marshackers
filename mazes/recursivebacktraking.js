async function rec_backtrack() {
  inProgress = true;
  clearBoard((keepWalls = false));
  var direction = {
    "0": [0, 1], //north
    "1": [0, -1], //south
    "2": [-1, 0], //west
    "3": [1, 0], //east
  };
  var visited = createVisited();
  visited[startCell[0]][startCell[1]] = true;
  visited[endCell[0]][endCell[1]] = true;
  visited[endcell2[0]][endcell2[1]] = true;
  var walls = makeWalls();
  walls[startCell[0]][startCell[1]] = false;
  walls[endCell[0]][endCell[1]] = false;
  walls[endcell2[0]][endcell2[1]] = false;
  var cx = 0;
  var cy = 0;
  for (i = 0; i < 4; i++) {
    var random = Math.floor(Math.random() * 4);
    var i_increment = direction[random][0];
    var j_increment = direction[random][1];
    nx = cx + i_increment;
    ny = cy + j_increment;
    if (visited[nx][ny] || walls[nx][ny]) {
      continue;
    }
    visited[nx][ny] = true;
    walls[nx][ny] = true;
    cellsToAnimate.push([[nx, ny], "wall"]);

    cx = nx;
    cy = ny;
  }
}
