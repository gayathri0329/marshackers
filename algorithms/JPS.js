//works for only one end cell
function jumpPointSearch(heuristic) {
  var pathFound = false;
  var myHeap = new minHeap();
  var prev = createPrev();
  var distances = createDistances();
  var costs = createDistances();
  var visited = createVisited();
  var walls = createVisited();
  distances[startCell[0]][startCell[1]] = 0;
  costs[startCell[0]][startCell[1]] = 0;
  myHeap.push([0, [startCell[0], startCell[1]]]);
  cellsToAnimate.push([[startCell[0], startCell[1]], "searching"]);
  while (!myHeap.isEmpty()) {
    var cell = myHeap.getMin();
    var i = cell[1][0];
    var j = cell[1][1];
    if (visited[i][j]) {
      continue;
    }
    visited[i][j] = true;
    cellsToAnimate.push([[i, j], "visited"]);
    if (i == endCell[0] && j == endCell[1]) {
      pathFound = true;
      break;
    }
    var neighbors = pruneNeighbors(i, j, visited, walls);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }
      var newDistance = distances[i][j] + findheuristics(heuristic, i, j, m, n);
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        cellsToAnimate.push([[m, n], "searching"]);
      }
      var newCost =
        distances[i][j] +
        findheuristics(heuristic, endCell[0], endCell[1], m, n);
      if (newCost < costs[m][n]) {
        costs[m][n] = newCost;
        myHeap.push([newCost, [m, n]]);
      }
    }
  }
  // Make any nodes still in the heap "visited"
  while (!myHeap.isEmpty()) {
    var cell = myHeap.getMin();
    var i = cell[1][0];
    var j = cell[1][1];
    if (visited[i][j]) {
      continue;
    }
    visited[i][j] = true;
    cellsToAnimate.push([[i, j], "visited"]);
  }
  // If a path was found, illuminate it:
  if (pathFound) {
    var i = endCell[0];
    var j = endCell[1];
    cellsToAnimate.push([endCell, "success"]);
    while (prev[i][j] != null) {
      var prevCell = prev[i][j];
      x = prevCell[0];
      y = prevCell[1];
      // Loop through and illuminate each cell in between [i, j] and [x, y]
      // Horizontal
      if (i - x == 0) {
        // Move right
        if (j < y) {
          for (var k = j; k < y; k++) {
            cellsToAnimate.push([[i, k], "success"]);
          }
          // Move left
        } else {
          for (var k = j; k > y; k--) {
            cellsToAnimate.push([[i, k], "success"]);
          }
        }
        // Vertical
      } else {
        // Move down
        if (i < x) {
          for (var k = i; k < x; k++) {
            cellsToAnimate.push([[k, j], "success"]);
          }
          // Move up
        } else {
          for (var k = i; k > x; k--) {
            cellsToAnimate.push([[k, j], "success"]);
          }
        }
      }
      i = prevCell[0];
      j = prevCell[1];
      cellsToAnimate.push([[i, j], "success"]);
    }
  }
  return pathFound;
}
