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
  var k = -1;
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
      k = 1;
      break;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      pathFound = true;
      k = 2;
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
      var nc =
        distances[i][j] +
        findheuristics(heuristic, endcell2[0], endcell2[1], m, n);
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
  // If a path was found, illuminate it:
  if (pathFound) {
    if (k == 1) {
      var i = endCell[0];
      var j = endCell[1];
      cellsToAnimate.push([endCell, "success"]);
    } else if (k == 2) {
      var i = endcell2[0];
      var j = endcell2[1];
      cellsToAnimate.push([endcell2, "success"]);
    }

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

function pruneNeighbors(i, j, visited, walls) {
  var neighbors = [];
  var stored = {};
  // Scan horizontally
  for (var num = 0; num < 2; num++) {
    if (!num) {
      var direction = "right";
      var increment = 1;
    } else {
      var direction = "left";
      var increment = -1;
    }
    for (var c = j + increment; c < totalCols && c >= 0; c += increment) {
      var xy = i + "-" + c;
      if (visited[i][c]) {
        break;
      }
      //Check if same row or column as end cell
      if (
        endCell[0] == i ||
        endCell[1] == c ||
        ((endcell2[0] == i || endcell2[1] == c) && !stored[xy])
      ) {
        neighbors.push([i, c]);
        stored[xy] = true;
        continue;
      }
      // Check if dead end
      var deadEnd =
        !(xy in stored) &&
        ((direction == "left" && c > 0 && walls[i][c - 1]) ||
          (direction == "right" && c < totalCols - 1 && walls[i][c + 1]) ||
          c == totalCols - 1 ||
          c == 0);
      if (deadEnd) {
        neighbors.push([i, c]);
        stored[xy] = true;
        break;
      }
      //Check for forced neighbors
      var validForcedNeighbor =
        (direction == "right" && c < totalCols - 1 && !walls[i][c + 1]) ||
        (direction == "left" && c > 0 && !walls[i][c - 1]);
      if (validForcedNeighbor) {
        checkForcedNeighbor(i, c, direction, neighbors, walls, stored);
      }
    }
  }
  // Scan vertically
  for (var num = 0; num < 2; num++) {
    if (!num) {
      var direction = "down";
      var increment = 1;
    } else {
      var direction = "up";
      var increment = -1;
    }
    for (var r = i + increment; r < totalRows && r >= 0; r += increment) {
      var xy = r + "-" + j;
      if (visited[r][j]) {
        break;
      }
      if ((endCell[0] == r || endCell[1] == j) && !stored[xy]) {
        neighbors.push([r, j]);
        stored[xy] = true;
        continue;
      }
      // Check if dead end
      var deadEnd =
        !(xy in stored) &&
        ((direction == "up" && r > 0 && walls[r - 1][j]) ||
          (direction == "down" && r < totalRows - 1 && walls[r + 1][j]) ||
          r == totalRows - 1 ||
          r == 0);
      if (deadEnd) {
        neighbors.push([r, j]);
        stored[xy] = true;
        break;
      }
      //Check for forced neighbors
      var validForcedNeighbor =
        (direction == "down" && r < totalRows - 1 && !walls[r + 1][j]) ||
        (direction == "up" && r > 0 && !walls[r - 1][j]);
      if (validForcedNeighbor) {
        checkForcedNeighbor(r, j, direction, neighbors, walls, stored);
      }
    }
  }
  return neighbors;
}

function checkForcedNeighbor(i, j, direction, neighbors, walls, stored) {
  if (direction == "right") {
    var isForcedNeighbor =
      (i > 0 && walls[i - 1][j] && !walls[i - 1][j + 1]) ||
      (i < totalRows - 1 && walls[i + 1][j] && !walls[i + 1][j + 1]);
    var neighbor = [i, j + 1];
  } else if (direction == "left") {
    var isForcedNeighbor =
      (i > 0 && walls[i - 1][j] && !walls[i - 1][j - 1]) ||
      (i < totalRows - 1 && walls[i + 1][j] && !walls[i + 1][j - 1]);
    var neighbor = [i, j - 1];
  } else if (direction == "up") {
    var isForcedNeighbor =
      (j < totalCols - 1 && walls[i][j + 1] && !walls[i - 1][j + 1]) ||
      (j > 0 && walls[i][j - 1] && !walls[i - 1][j - 1]);
    var neighbor = [i - 1, j];
  } else {
    var isForcedNeighbor =
      (j < totalCols - 1 && walls[i][j + 1] && !walls[i + 1][j + 1]) ||
      (j > 0 && walls[i][j - 1] && !walls[i + 1][j - 1]);
    var neighbor = [i + 1, j];
  }
  var xy = neighbor[0] + "-" + neighbor[1];
  if (isForcedNeighbor && !stored[xy]) {
    neighbors.push(neighbor);
    stored[xy] = true;
  } else {
    //console.log("Is not a forced neighbor..");
  }
  //return;
}
