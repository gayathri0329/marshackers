async function randomMaze() {
  1;
  inProgress = true;
  clearBoard((keepWalls = false));
  var visited = createVisited();
  var walls = makeWalls();
  var cells = [startCell, endCell, endcell2];
  walls[startCell[0]][startCell[1]] = false;
  walls[endCell[0]][endCell[1]] = false;
  walls[endcell2[0]][endcell2[1]] = false;
  visited[startCell[0]][startCell[1]] = true;
  visited[endCell[0]][endCell[1]] = true;
  visited[endcell2[0]][endcell2[1]] = true;
  while (cells.length > 0) {
    var random = Math.floor(Math.random() * cells.length);
    var randomCell = cells[random];
    cells[random] = cells[cells.length - 1];
    cells.pop();
    var neighbors = getNeighbors(randomCell[0], randomCell[1]);
    if (neighborsThatAreWalls(neighbors, walls) < 2) {
      continue;
    }
    walls[randomCell[0]][randomCell[1]] = false;
    for (var k = 0; k < neighbors.length; k++) {
      var i = neighbors[k][0];
      var j = neighbors[k][1];
      if (visited[i][j]) {
        continue;
      }
      visited[i][j] = true;
      cells.push([i, j]);
    }
  }
  //Animate cells
  var cells = $("#tableContainer").find("td");
  for (var i = 0; i < totalRows; i++) {
    for (var j = 0; j < totalCols; j++) {
      if (
        i == 0 ||
        i == totalRows - 1 ||
        j == 0 ||
        j == totalCols - 1 ||
        walls[i][j]
      ) {
        cellsToAnimate.push([[i, j], "wall"]);
      }
    }
  }
  await animateCells();
  inProgress = false;
  return;
}
