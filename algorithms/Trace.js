function trace() {
  var pathFound = false;
  var myHeap = new minHeap();
  var prev = createPrev();
  var distances = createDistances();
  var costs = createDistances();
  var visited = createVisited();
  //Setting f and g value of startCell as 0.
  distances[startCell[0]][startCell[1]] = 0;
  costs[startCell[0]][startCell[1]] = 0;
  //Pushing startCell in heap.
  myHeap.push([0, [startCell[0], startCell[1]]]);
  cellsToAnimate.push([[startCell[0], startCell[1]], "searching"]);
  var k = -1;
  // while the heap is not empty
  while (!myHeap.isEmpty()) {
    //Get cell with min f-value
    var cell = myHeap.getMin();
    var i = cell[1][0];
    var j = cell[1][1];

    cellsToAnimate.push([[i, j], "visited"]);
    //If reached endCell or endCell2, stop.
    if (i == endCell[0] && j == endCell[1]) {
      k = 0;
      pathFound = true;
      break;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      k = 1;
      pathFound = true;
      break;
    }
    //Get neighbors of current cell.
    var neighbors = getNeighbors_ifdiag(i, j);
    //For every neighbor,
    for (var k = 0; k < neighbors.length; k++) {
      //Get indices of that neighbor
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }
      //Cell being inspected: (i,j) and neighbor being inspected: (m,n)

      //Distance from startCell to neighbor via cell (if diagonal movement: sqrt(2) added instaed of 1)
      var newDistance =
        distances[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
      //If this distance is less than distances[m][n] i.e. distances find before,
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        cellsToAnimate.push([[m, n], "searching"]);
      }
      //No.of neighbors of current neighbor divided by 9 = a number smaller than 1.
      var u = getNeighbors_ifdiag(m, n).length / 9;
      //console.log(u);
      //Calculating cost from endCell : Heuristic pre-defined here as Manhattan
      var newCost =
        u * distances[i][j] +
        findheuristics(heuristic, endCell[0], endCell[1], m, n);
      if (newCost < costs[m][n]) {
        costs[m][n] = newCost;
        myHeap.push([newCost, [m, n]]);
      }
      //Calculating cost from endCell2 : Heuristic pre-defined here as Manhattan
      var nc =
        u * distances[i][j] +
        findheuristics(heuristic, endcell2[0], endcell2[1], m, n);
      Math.abs(endcell2[0] - m) + Math.abs(endcell2[1] - n);
      if (nc < costs[m][n]) {
        costs[m][n] = nc;
        myHeap.push([nc, [m, n]]);
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
  console.log(pathFound);
  return pathFound;
}
