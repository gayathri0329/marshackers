function greedyBestFirstSearch(heuristic) {
  var pathFound = false;
  var myHeap = new minHeap();
  var prev = createPrev();
  var costs = createDistances();
  var visited = createVisited();
  var k = -1;
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
      k = 0;
      break;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      pathFound = true;
      k = 1;
      break;
    }
    var neighbors = getNeighbors_ifdiag(i, j);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }
      var newCost = findheuristics(heuristic, endCell[0], endCell[1], m, n);
      var nc = findheuristics(heuristic, endcell2[0], endcell2[1], m, n);
      if (newCost < costs[m][n]) {
        prev[m][n] = [i, j];
        costs[m][n] = newCost;
        myHeap.push([newCost, [m, n]]);
        cellsToAnimate.push([[m, n], "searching"]);
      }
      if (nc < costs[m][n]) {
        prev[m][n] = [i, j];
        costs[m][n] = nc;
        myHeap.push([nc, [m, n]]);
        cellsToAnimate.push([[m, n], "searching"]);
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
  // If a path was found, illuminate it
  if (pathFound) {
    if (k == 0) {
      var i = endCell[0];
      var j = endCell[1];
    }
    if (k == 1) {
      var i = endcell2[0];
      var j = endcell2[1];
    }

    cellsToAnimate.push([[i, j], "success"]);
    while (prev[i][j] != null) {
      var prevCell = prev[i][j];
      i = prevCell[0];
      j = prevCell[1];
      cellsToAnimate.push([[i, j], "success"]);
    }
  }

  return pathFound;
}
