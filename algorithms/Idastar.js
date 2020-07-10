function idastar(heuristic) {
  //weight = 1;
  var bound = findheuristics(
    heuristic,
    startCell[0],
    startCell[1],
    endCell[0],
    endCell[1]
  );
  var bound1 = findheuristics(
    heuristic,
    startCell[0],
    startCell[1],
    endcell2[0],
    endcell2[1]
  );
  //var Q = new Queue();
  var pathFound1 = false;
  var pathFound2 = false;
  var t;
  var t1;
  var visited = createVisited();
  visited[startCell[0]][startCell[1]] = true;
  var visited1 = createVisited();
  visited1[startCell[0]][startCell[1]] = true;
  var arr = new Array(totalRows);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
  arr[0] = startCell;
  var arr1 = new Array(totalRows);
  for (var i = 0; i < arr1.length; i++) {
    arr1[i] = [];
  }
  arr1[0] = startCell;
  //console.log(arr[0]);

  //var distances = createDistances();
  //distances[startCell[0]][startCell[1]] = 0;
  //Q.enqueue(startCell);
  //console.log(myHeap);
  while (true) {
    t = search(arr, 0, bound, visited, "endcell");
    if (t == -1) {
      pathFound1 = true;
      var y1 = "endcell1";
      console.log(y1);
      console.log("Pathfound for first end cell");
      break;
    }

    if (t == Infinity) {
      console.log("Path not found");
      break;
    } else {
      bound = t;
    }
  }
  while (true) {
    t1 = search(arr1, 0, bound1, visited1, "endcell2");
    if (t1 == -1) {
      pathFound2 = true;
      var y2 = "endcell2";
      break;
    }
    if (t1 == Infinity) {
      break;
    } else {
      bound1 = t1;
    }
  }
  if (y1 == "endcell1" && arr.length <= arr1.length) {
    console.log("First cell loop");
    if (pathFound1) {
      for (var i = 0; i < arr.length; i++) {
        cellsToAnimate.push([[arr[i][0], arr[i][1]], "success"]);
        console.log(arr[i]);
      }
    }
  }
  if (y2 == "endcell2" && arr1.length <= arr.length) {
    if (pathFound2) {
      for (var i = 0; i < arr1.length; i++) {
        cellsToAnimate.push([[arr1[i][0], arr1[i][1]], "success"]);
      }
    }
  }
}
function search(path, distance, bound, visited, x) {
  //console.log("I am in");
  var cell = path[0];
  var i = cell[0];
  var j = cell[1];
  console.log(i, j);
  visited[i][j] = true;
  //console.log(visited[i][j]);
  cellsToAnimate.push([[i, j], "visited"]);
  //console.log(i, j);
  if (x == "endcell") {
    var f1 = distance + findheuristics(heuristic, endCell[0], endCell[1], i, j);
    //console.log("endcell1");
    if (f1 > bound) {
      //console.log(f);
      return f1;
    }
    if (i == endCell[0] && j == endCell[1]) {
      return -1;
    }
  }
  if (x == "endcell2") {
    var f2 =
      distance + findheuristics(heuristic, endcell2[0], endcell2[1], i, j);
    //console.log("endcell2");
    if (f2 > bound) {
      //console.log(f);
      return f2;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      return -1;
    }
  }

  if (x == "endcell") {
    //console.log(i, j);
    console.log("endcell1");
    var min = Infinity;
    var neighbors = getNeighbors(i, j);
    //console.log(neighbors);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      //console.log(m, n);
      //console.log(visited[m][n]);
      if (visited[m][n]) {
        continue;
      }
      visited[m][n] = true;
      path.unshift(neighbors[k]);
      cellsToAnimate.push([[m, n], "searching"]);
      t = search(path, distance + 1, bound, visited, "endcell");
      if (t == -1) {
        return -1;
      }
      if (t < min) {
        min = t;
      }
      path.shift();
    }
    return min;
  }
  if (x == "endcell2") {
    //console.log(i, j);
    console.log("endcell2");
    var min = Infinity;
    var neighbors = getNeighbors(i, j);
    //console.log(neighbors);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      //console.log(m, n);
      //console.log(visited[m][n]);
      if (visited[m][n]) {
        continue;
      }
      visited[m][n] = true;
      path.unshift(neighbors[k]);
      cellsToAnimate.push([[m, n], "searching"]);
      t1 = search(path, distance + 1, bound, visited, "endcell2");
      if (t1 == -1) {
        return -1;
      }
      if (t1 < min) {
        min = t1;
      }
      path.shift();
    }

    return min;
  }
}
