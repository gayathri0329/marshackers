function BFS() {
  var pathFound = false;
  var myQueue = new Queue();
  var prev = createPrev();
  var visited = createVisited();
  myQueue.enqueue(startCell);
  var k = -1;
  cellsToAnimate.push(startCell, "searching");
  visited[startCell[0]][startCell[1]] = true; //set the start cell to visited
  while (!myQueue.empty()) {
    var cell = myQueue.dequeue();
    var r = cell[0];
    var c = cell[1];
    cellsToAnimate.push([cell, "visited"]);
    if (r == endCell[0] && c == endCell[1]) {
      k = 0; //if endcell1 was found
      pathFound = true;
      break;
    }
    if (r == endcell2[0] && c == endcell2[1]) {
      k = 1; //if endcell2 was found
      pathFound = true;
      break;
    }
    // Put neighboring cells in queue
    var neighbors = getNeighbors_ifdiag(r, c);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      //console.log(m, n);
      //console.log(visited[m][n]);

      if (visited[m][n]) {
        //if the neighbour is already visited continue
        continue;
      }

      visited[m][n] = true; //if not , visit neighbour and set it to true
      prev[m][n] = [r, c];
      cellsToAnimate.push([neighbors[k], "searching"]);
      myQueue.enqueue(neighbors[k]);
    }
  }
  // Make any nodes still in the queue "visited"
  while (!myQueue.empty()) {
    var cell = myQueue.dequeue();
    var r = cell[0];
    var c = cell[1];
    cellsToAnimate.push([cell, "visited"]);
  }
  // If a path was found, illuminate it
  if (pathFound) {
    if (k == 0) {
      //if the first endcell was found
      var r = endCell[0];
      var c = endCell[1];
    }
    if (k == 1) {
      //if the second end cell was found
      var r = endcell2[0];
      var c = endcell2[1];
    }
    cellsToAnimate.push([[r, c], "success"]);
    while (prev[r][c] != null) {
      var prevCell = prev[r][c];
      r = prevCell[0];
      c = prevCell[1];
      cellsToAnimate.push([[r, c], "success"]);
    }
  }
  return pathFound;
}
