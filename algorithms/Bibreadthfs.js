function BiBreadthFS() {
  var pathFound = false;
  var myQueue = new Queue();
  var Q1 = new Queue();
  var Q2 = new Queue();
  var prev = createPrev();
  var prev1 = createPrev();
  var prev2 = createPrev();
  var visited = createVisited();
  var visited1 = createVisited();
  var visited2 = createVisited();
  var walls = createVisited();
  var l = 0;
  var By_start = 0;
  var By_end = 1;
  var By_end2 = 2;
  var f = -1;
  /*var neighbours_endcell = getNeighbors(endCell[0], endCell[1]);
  if (neighborsThatAreWalls(neighbours_endcell, walls) == 4) {
    l = 1;
    console.log("end cell 1 is surrounded");
  }
  var neighbours_endcell = getNeighbors(endcell2[0], endcell2[1]);
  if (neighborsThatAreWalls(neighbours_endcell, walls) == 4) {
    l = 2;
    console.log("end cell 2 is surrounded");
  }*/
  var arr = new Array(totalRows);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
  //console.log("1111");
  myQueue.enqueue(startCell);
  Q1.enqueue(endCell);
  Q2.enqueue(endcell2);
  cellsToAnimate.push(startCell, "searching");
  cellsToAnimate.push(endCell, "searching");
  cellsToAnimate.push(endcell2, "searching");
  visited[startCell[0]][startCell[1]] = true;
  visited1[endCell[0]][endCell[1]] = true;
  visited2[endcell2[0]][endcell2[1]] = true;
  arr[startCell] = By_start;
  arr[endCell] = By_end;
  arr[endcell2] = By_end2;

  while (!myQueue.empty() && (!Q1.empty() || !Q2.empty())) {
    var cell = myQueue.dequeue();
    var r = cell[0];
    var c = cell[1];
    cellsToAnimate.push([cell, "visited"]);
    var neighbors = getNeighbors(r, c);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];

      if (visited[m][n]) {
        continue;
      }
      if (!visited[m][n]) {
        if (arr[m][n] == By_end) {
          pathFound = true;
          var i = r;
          var j = c;
          var l = m;
          var k = n;
          f = 0;
          console.log("break1");
          break;
        }
        if (arr[m][n] == By_end2) {
          pathFound = true;
          var i = r;
          var j = c;
          var l = m;
          var k = n;
          f = 2;
          console.log("break4");
          break;
        }
        visited[m][n] = true;
        prev[m][n] = [r, c];
        cellsToAnimate.push([neighbors[k], "searching"]);
        myQueue.enqueue(neighbors[k]);
        arr[m][n] = By_start;
      }
    }
    if (f == 0 || f == 2) {
      break;
    }
    if (!Q1.empty()) {
      var cell = Q1.dequeue();
      var r = cell[0];
      var c = cell[1];
      cellsToAnimate.push([cell, "visited"]);
      var neighbors = getNeighbors(r, c);
      for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];

        if (visited1[m][n]) {
          continue;
        }
        if (!visited1[m][n]) {
          if (arr[m][n] == By_start) {
            pathFound = true;
            var i = r;
            var j = c;
            var l = m;
            var k = n;
            var f = 1;
            console.log("Break2");
            break;
          }

          visited1[m][n] = true;
          prev1[m][n] = [r, c];
          cellsToAnimate.push([neighbors[k], "searching"]);
          Q1.enqueue(neighbors[k]);
          arr[m][n] = By_end;
        }
      }
      if (f == 1) {
        break;
      }
    }
    if (!Q2.empty()) {
      var cell = Q2.dequeue();
      var r = cell[0];
      var c = cell[1];
      cellsToAnimate.push([cell, "visited"]);
      var neighbors = getNeighbors(r, c);
      for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];

        if (visited2[m][n]) {
          continue;
        }
        if (!visited2[m][n]) {
          if (arr[m][n] == By_start) {
            pathFound = true;
            var i = r;
            var j = c;
            var l = m;
            var k = n;
            var f = 3;
            console.log("Break3");
            break;
          }

          visited2[m][n] = true;
          prev2[m][n] = [r, c];
          cellsToAnimate.push([neighbors[k], "searching"]);
          Q2.enqueue(neighbors[k]);
          arr[m][n] = By_end2;
        }
      }
      if (f == 3) {
        break;
      }
    }
  }

  while (!myQueue.empty()) {
    var cell = myQueue.dequeue();
    var r = cell[0];
    var c = cell[1];
    cellsToAnimate.push([cell, "visited"]);
  }
  while (!Q1.empty()) {
    var cell = Q1.dequeue();
    var r = cell[0];
    var c = cell[1];
    cellsToAnimate.push([cell, "visited"]);
  }
  while (!Q2.empty()) {
    var cell = Q2.dequeue();
    var r = cell[0];
    var c = cell[1];
    cellsToAnimate.push([cell, "visited"]);
  }
  if (pathFound == true) {
    console.log(i);
    console.log(j);
    cellsToAnimate.push([[i, j], "success"]);
    cellsToAnimate.push([[l, k], "success"]);
    var r = i;
    var c = j;
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
