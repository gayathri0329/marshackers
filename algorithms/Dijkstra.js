function dijkstra() {
  var pathFound = false;
  var myHeap = new minHeap();
  var prev = createPrev();
  var distances = createDistances();
  var visited = createVisited();
  var k = -1;
  distances[startCell[0]][startCell[1]] = 0;
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
      k = 0;
      pathFound = true;
      break;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      k = 1;
      pathFound = true;
      break;
    }
    var neighbors = getNeighbors(i, j);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }
      var newDistance = distances[i][j] + 1;
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        myHeap.push([newDistance, [m, n]]);
        //console.log("New cell was added to the heap! It has distance = " + newDistance + ". Heap = " + JSON.stringify(myHeap.heap));
        cellsToAnimate.push([[m, n], "searching"]);
      }
    }
    //console.log("Cell [" + i + ", " + j + "] was just evaluated! myHeap is now: " + JSON.stringify(myHeap.heap));
  }
  //console.log(JSON.stringify(myHeap.heap));
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
