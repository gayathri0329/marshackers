function bibestfs(heuristic) {
  var pathFound = false;
  var myHeap = new minHeap();
  var Heap1 = new minHeap();
  var Heap2 = new minHeap();
  var prev = createPrev();
  var prev1 = createPrev();
  var prev2 = createPrev();
  var costs = createDistances();
  var costs1 = createDistances();
  var costs2 = createDistances();
  var visited = createVisited();
  var visited1 = createVisited();
  var visited2 = createVisited();
  var By_start = 0;
  var By_end = 1;
  var f = -1;
  var By_end2 = 2;
  costs[startCell[0]][startCell[1]] = 0;
  costs1[endCell[0]][endCell[1]] = 0;
  costs2[endcell2[0]][endcell2[1]] = 0;
  myHeap.push([0, [startCell[0], startCell[1]]]);
  Heap1.push([0, [endCell[0], endCell[1]]]);
  Heap2.push([0, [endcell2[0], endcell2[1]]]);
  cellsToAnimate.push([[startCell[0], startCell[1]], "searching"]);
  cellsToAnimate.push([[endCell[0], endCell[1]], "searching"]);
  cellsToAnimate.push([[endcell2[0], endcell2[1]], "searching"]);
  var arr = new Array(totalRows);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
  arr[startCell] = By_start;
  arr[endCell] = By_end;
  arr[endcell2] = By_end2;
  while (!myHeap.isEmpty() && (!Heap1.isEmpty() || !Heap2.isEmpty())) {
    //console.log("Bibestsearch");
    var cell = myHeap.getMin();
    var i = cell[1][0];
    var j = cell[1][1];
    cellsToAnimate.push([[i, j], "visited"]);
    var neighbors = getNeighbors_ifdiag(i, j);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }
      if (arr[m][n] == By_end) {
        //if the node is already visited by first end
        pathFound = true;
        var p = i;
        var q = j;
        var l = m;
        var k = n;
        f = 0;
        console.log("break1");
        break;
      }
      if (arr[m][n] == By_end2) {
        //if the node is already visited by second end
        pathFound = true;
        var p = i;
        var q = j;
        var l = m;
        var k = n;
        f = 2;
        console.log("break4");
        break;
      }
      visited[m][n] = true;

      var newCost = findheuristics(heuristic, endCell[0], endCell[1], m, n);
      var nc = findheuristics(heuristic, endcell2[0], endcell2[1], m, n);
      if (newCost < costs[m][n]) {
        prev[m][n] = [i, j];
        costs[m][n] = newCost;
        myHeap.push([newCost, [m, n]]);
        cellsToAnimate.push([[m, n], "searching"]);
        arr[m][n] = By_start;
      }
      if (nc < costs[m][n]) {
        prev[m][n] = [i, j];
        costs[m][n] = nc;
        myHeap.push([nc, [m, n]]);
        cellsToAnimate.push([[m, n], "searching"]);
        arr[m][n] = By_start;
      }
    }
    if (f == 0 || f == 2) {
      break;
    }
    if (!Heap1.isEmpty()) {
      var cell = Heap1.getMin();
      var i = cell[1][0];
      var j = cell[1][1];
      cellsToAnimate.push([[i, j], "visited"]);
      var neighbors = getNeighbors_ifdiag(i, j);
      for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];
        if (visited1[m][n]) {
          continue;
        }
        if (arr[m][n] == By_start) {
          //if the node is already visited by first end
          pathFound = true;
          var p = i;
          var q = j;
          var l = m;
          var k = n;
          f = 1;
          console.log("break///");
          break;
        }

        visited1[m][n] = true;

        var newCost = findheuristics(
          heuristic,
          startCell[0],
          startCell[1],
          m,
          n
        );
        if (newCost < costs1[m][n]) {
          prev1[m][n] = [i, j];
          costs1[m][n] = newCost;
          Heap1.push([newCost, [m, n]]);
          cellsToAnimate.push([[m, n], "searching"]);
          arr[m][n] = By_end;
        }
      }
    }
    if (f == 1) {
      break;
    }
    if (!Heap2.isEmpty()) {
      var cell = Heap2.getMin();
      var i = cell[1][0];
      var j = cell[1][1];
      cellsToAnimate.push([[i, j], "visited"]);
      var neighbors = getNeighbors_ifdiag(i, j);
      for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];
        if (visited2[m][n]) {
          continue;
        }
        if (arr[m][n] == By_start) {
          //if the node is already visited by first end
          pathFound = true;
          var p = i;
          var q = j;
          var l = m;
          var k = n;
          f = 3;
          console.log("break3");
          break;
        }

        visited2[m][n] = true;

        var newCost = findheuristics(
          heuristic,
          startCell[0],
          startCell[1],
          m,
          n
        );
        if (newCost < costs2[m][n]) {
          prev2[m][n] = [i, j];
          costs2[m][n] = newCost;
          Heap2.push([newCost, [m, n]]);
          cellsToAnimate.push([[m, n], "searching"]);
        }
        arr[m][n] = By_end2;
      }
    }
    if (f == 3) {
      break;
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
  while (!Heap1.isEmpty()) {
    var cell = Heap1.getMin();
    var i = cell[1][0];
    var j = cell[1][1];
    if (visited1[i][j]) {
      continue;
    }
    visited1[i][j] = true;
    cellsToAnimate.push([[i, j], "visited"]);
  }
  while (!Heap2.isEmpty()) {
    var cell = Heap2.getMin();
    var i = cell[1][0];
    var j = cell[1][1];
    if (visited2[i][j]) {
      continue;
    }
    visited2[i][j] = true;
    cellsToAnimate.push([[i, j], "visited"]);
  }
  // If a path was found, illuminate it
  if (pathFound) {
    cellsToAnimate.push([[p, q], "success"]);
    cellsToAnimate.push([[l, k], "success"]);
    var r = p;
    var c = q;
    var a = l;
    var b = k;
    if (f == 0) {
      while (prev[r][c] != null) {
        console.log("I am in");
        var prevCell = prev[r][c];
        r = prevCell[0];
        c = prevCell[1];
        cellsToAnimate.push([[r, c], "success"]);
      }
      while (prev1[a][b] != null) {
        var prevCell = prev1[a][b];
        a = prevCell[0];
        b = prevCell[1];
        cellsToAnimate.push([[a, b], "success"]);
      }
    } else if (f == 1) {
      while (prev1[r][c] != null) {
        console.log("I am in");
        var prevCell = prev1[r][c];
        r = prevCell[0];
        c = prevCell[1];
        cellsToAnimate.push([[r, c], "success"]);
      }
      while (prev[a][b] != null) {
        var prevCell = prev[a][b];
        a = prevCell[0];
        b = prevCell[1];
        cellsToAnimate.push([[a, b], "success"]);
      }
    } else if (f == 2) {
      while (prev[r][c] != null) {
        console.log("I am in");
        var prevCell = prev[r][c];
        r = prevCell[0];
        c = prevCell[1];
        cellsToAnimate.push([[r, c], "success"]);
      }
      while (prev2[a][b] != null) {
        var prevCell = prev2[a][b];
        a = prevCell[0];
        b = prevCell[1];
        cellsToAnimate.push([[a, b], "success"]);
      }
    } else if (f == 3) {
      while (prev2[r][c] != null) {
        console.log("I am in");
        var prevCell = prev2[r][c];
        r = prevCell[0];
        c = prevCell[1];
        cellsToAnimate.push([[r, c], "success"]);
      }
      while (prev[a][b] != null) {
        var prevCell = prev[a][b];
        a = prevCell[0];
        b = prevCell[1];
        cellsToAnimate.push([[a, b], "success"]);
      }
    }
  }
  return pathFound;
}
