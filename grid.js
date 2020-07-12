/*These functions are not being called */
/* createVisited is a function that returns a 2-D array . It marks true if the cell is a wall otherwise false.*/

function createVisited() {
  var visited = [];
  var cells = $("#tableContainer").find("td");
  for (var i = 0; i < totalRows; i++) {
    var row = [];
    for (var j = 0; j < totalCols; j++) {
      if (cellIsAWall(i, j, cells)) {
        row.push(true);
      } else {
        row.push(false);
      }
    }
    visited.push(row);
  }
  return visited;
}
/*cellIsAwWall function checks whether there is a wall at a particular cell and returns true and false*/

function cellIsAWall(i, j, cells) {
  var cellNum = i * totalCols + j;
  return $(cells[cellNum]).hasClass("wall");
}
/*inBounds function takes an input cell and returns true if the cell is within the grid otherwise false*/

function inBounds(cell) {
  return (
    cell[0] >= 0 && cell[1] >= 0 && cell[0] < totalRows && cell[1] < totalCols
  );
}
/*makeWalls function is used in the implementation of random maze*/

function makeWalls() {
  var walls = [];
  for (var i = 0; i < totalRows; i++) {
    var row = [];
    for (var j = 0; j < totalCols; j++) {
      row.push(true);
    }
    walls.push(row);
  }
  return walls;
}
/*createDistances is a function that returns a 2-D array containing distance.Initially all cells have a distave of Infinity*/

function createDistances() {
  var distances = [];
  for (var i = 0; i < totalRows; i++) {
    var row = [];
    for (var j = 0; j < totalCols; j++) {
      row.push(Number.POSITIVE_INFINITY);
    }
    distances.push(row);
  }
  return distances;
}
/*createPrev returns a 2-D array .Initially it is null for all cells.In algorithms it has been used to store parent cell of a cell*/

function createPrev() {
  var prev = [];
  for (var i = 0; i < totalRows; i++) {
    var row = [];
    for (var j = 0; j < totalCols; j++) {
      row.push(null);
    }
    prev.push(row);
  }
  return prev;
}
/*It returns the neighbouring cell of a given cell*/

function getNeighbors_ifdiag(i, j) {
  var neighbors = [];
  if (i > 0) {
    neighbors.push([i - 1, j]);
  }
  if (j > 0) {
    neighbors.push([i, j - 1]);
  }
  if (i < totalRows - 1) {
    neighbors.push([i + 1, j]);
  }
  if (j < totalCols - 1) {
    neighbors.push([i, j + 1]);
  }
  if (allow_diag == true) {
    if (i > 0 && j > 0) {
      neighbors.push([i - 1, j - 1]);
    }
    if (i > 0 && j < totalCols - 1) {
      neighbors.push([i - 1, j + 1]);
    }
    if (i < totalRows - 1 && j < totalCols - 1) {
      neighbors.push([i + 1, j + 1]);
    }
    if (i < totalRows - 1 && j > 0) {
      neighbors.push([i + 1, j - 1]);
    }
  }
  return neighbors;
}

function getNeighbors(i, j) {
  var neighbors = [];
  if (i > 0) {
    neighbors.push([i - 1, j]);
  }
  if (j > 0) {
    neighbors.push([i, j - 1]);
  }
  if (i < totalRows - 1) {
    neighbors.push([i + 1, j]);
  }
  if (j < totalCols - 1) {
    neighbors.push([i, j + 1]);
  }
  return neighbors;
}

function findheuristics(heuristic, x, y, a, b) {
  if (heuristic == "Manhattan") {
    //console.log("Manhattan");
    return Math.abs(x - a) + Math.abs(y - b);
  } else if (heuristic == "Euclidean") {
    //console.log("euclidean");
    return Math.sqrt(
      Math.abs(x - a) * Math.abs(x - a) + Math.abs(y - b) * Math.abs(y - b)
    );
  } else if (heuristic == "Octile") {
    //console.log("Octile");
    var F = Math.SQRT2 - 1;
    return Math.abs(x - a) < Math.abs(y - b)
      ? F * Math.abs(x - a) + Math.abs(y - b)
      : F * Math.abs(y - b) + Math.abs(x - a);
  } else if (heuristic == "Chebyshev") {
    //console.log("Chebyshev");
    return Math.max(Math.abs(x - a), Math.abs(y - b));
  }
}
