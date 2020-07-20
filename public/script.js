/*To do list 
Implement JPS for 2 end nodes
Add different mazes other than present in this code */
var totalRows = 23;
var totalCols = 51;
var inProgress = false;
var cellsToAnimate = [];
var createWalls = false;
var algorithm = null;
var justFinished = false;
var animationSpeed = "Fast";
var animationState = null;
var startCell = [11, 15];
var endCell = [11, 25];
var endcell2 = [11, 30];
var movingStart = false;
var movingEnd = false;
var movingEnd2 = false;
var heuristic = "Manhattan";
var weight = 1;
var allow_diag = true;
var dont_cross_corners = true;

function generateGrid(rows, cols) {
  var grid = "<table>";
  for (row = 1; row <= rows; row++) {
    grid += "<tr>";
    for (col = 1; col <= cols; col++) {
      grid += "<td></td>";
    }
    grid += "</tr>";
  }
  grid += "</table>";
  return grid;
}

var myGrid = generateGrid(totalRows, totalCols);
$("#tableContainer").append(myGrid);

function Queue() {
  this.stack = new Array();
  this.dequeue = function () {
    return this.stack.pop();
  };
  this.enqueue = function (item) {
    this.stack.unshift(item);
    return;
  };
  this.empty = function () {
    return this.stack.length == 0;
  };
  this.clear = function () {
    this.stack = new Array();
    return;
  };
}

function minHeap() {
  this.heap = [];
  this.isEmpty = function () {
    return this.heap.length == 0;
  };
  this.clear = function () {
    this.heap = [];
    return;
  };
  this.getMin = function () {
    if (this.isEmpty()) {
      return null;
    }
    var min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap[this.heap.length - 1] = min;
    this.heap.pop();
    if (!this.isEmpty()) {
      this.siftDown(0);
    }
    return min;
  };
  this.push = function (item) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
    return;
  };
  this.parent = function (index) {
    if (index == 0) {
      return null;
    }
    return Math.floor((index - 1) / 2);
  };
  this.children = function (index) {
    return [index * 2 + 1, index * 2 + 2];
  };
  this.siftDown = function (index) {
    var children = this.children(index);
    var leftChildValid = children[0] <= this.heap.length - 1;
    var rightChildValid = children[1] <= this.heap.length - 1;
    var newIndex = index;
    if (leftChildValid && this.heap[newIndex][0] > this.heap[children[0]][0]) {
      newIndex = children[0];
    }
    if (rightChildValid && this.heap[newIndex][0] > this.heap[children[1]][0]) {
      newIndex = children[1];
    }
    // No sifting down needed
    if (newIndex === index) {
      return;
    }
    var val = this.heap[index];
    this.heap[index] = this.heap[newIndex];
    this.heap[newIndex] = val;
    this.siftDown(newIndex);
    return;
  };
  this.siftUp = function (index) {
    var parent = this.parent(index);
    if (parent !== null && this.heap[index][0] < this.heap[parent][0]) {
      var val = this.heap[index];
      this.heap[index] = this.heap[parent];
      this.heap[parent] = val;
      this.siftUp(parent);
    }
    return;
  };
}

/* ------------------------- */
/* ---- MOUSE FUNCTIONS ---- */
/* ------------------------- */

$("td").mousedown(function () {
  var index = $("td").index(this);
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  var endcellindex2 = endcell2[0] * totalCols + endcell2[1];
  if (!inProgress) {
    // Clear board if just finished
    if (justFinished && !inProgress) {
      clearBoard((keepWalls = true));
      justFinished = false;
    }
    if (index == startCellIndex) {
      movingStart = true;
      //console.log("Now moving start!");
    } else if (index == endCellIndex) {
      movingEnd = true;
      //console.log("Now moving end!");
    } else if (index == endcellindex2) {
      movingEnd2 = true;
    } else {
      createWalls = true;
    }
  }
});

$("td").mouseup(function () {
  createWalls = false;
  movingStart = false;
  movingEnd = false;
  movingEnd2 = false;
});

$("td").mouseenter(function () {
  if (!createWalls && !movingStart && !movingEnd && !movingEnd2) {
    return;
  }
  var index = $("td").index(this);
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  var endcellindex2 = endcell2[0] * totalCols + endcell2[1];
  if (!inProgress) {
    if (justFinished) {
      clearBoard((keepWalls = true));
      justFinished = false;
    }
    //console.log("Cell index = " + index);
    if (movingStart && index != endCellIndex && index != endcellindex2) {
      moveStartOrEnd(startCellIndex, index, "start");
    } else if (movingEnd && index != startCellIndex && index != endcellindex2) {
      moveStartOrEnd(endCellIndex, index, "end");
    } else if (movingEnd2 && index != startCellIndex && index != endCellIndex) {
      moveStartOrEnd(endcellindex2, index, "end2");
    } else if (
      index != startCellIndex &&
      index != endCellIndex &&
      index != endcellindex2
    ) {
      $(this).toggleClass("wall");
    }
  }
});

$("td").click(function () {
  var index = $("td").index(this);
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  var endcellindex2 = endcell2[0] * totalCols + endcell2[1];
  if (
    inProgress == false &&
    !(index == startCellIndex) &&
    !(index == endCellIndex) &&
    !(index == endcellindex2)
  ) {
    if (justFinished) {
      clearBoard((keepWalls = true));
      justFinished = false;
    }
    $(this).toggleClass("wall");
  }
});

$("body").mouseup(function () {
  createWalls = false;
  movingStart = false;
  movingEnd = false;
  movingEnd2 = false;
});
$("#hide_instructions").click(function () {
  $("#instructions_panel").slideUp();
});

/* ----------------- */
/* ---- BUTTONS ---- */
/* ----------------- */

$("#startBtn").click(function () {
  if (algorithm == null) {
    return;
  }
  if (inProgress) {
    update("wait");
    return;
  }
  traverseGraph(algorithm);
});
$("#clearBtn").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  clearBoard((keepWalls = false));
});

/* --------------------- */
/* --- NAV BAR MENUS --- */
/* --------------------- */

$("#algorithms .dropdown-item").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  algorithm = $(this).text();
  updateStartBtnText();
  console.log("Algorithm has been changd to: " + algorithm);
});
$("#heuristics .dropdown-item").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  heuristic = $(this).text();
});
$("#weight_option .spinner").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  weight = parseInt($(this).val(), 10);
  if (weight <= 0) {
    weight = 1;
  }

  console.log("Weight " + weight);
});
$("#speed .dropdown-item").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  animationSpeed = $(this).text();
  updateSpeedDisplay();
  console.log("Speed has been changd to: " + animationSpeed);
});

$("#mazes .dropdown-item").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  maze = $(this).text();
  if (maze == "Random") {
    randomMaze();
  } else if (maze == "Recursive Division") {
    recursiveDivMaze(null);
  } else if (maze == "Recursive Division (Vertical Skew)") {
    recursiveDivMaze("VERTICAL");
  } else if (maze == "Recursive Division (Horizontal Skew)") {
    recursiveDivMaze("HORIZONTAL");
  } else if (maze == "Simple Spiral") {
    spiralMaze();
  }
  console.log("Maze has been changd to: " + maze);
});
$(".allow_diagonal").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  allow_diag = $(this).is(":checked");
  console.log(allow_diag);
});
$(".dont_cross").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  dont_cross_corners = $(this).is(":checked");
  console.log(dont_cross_corners);
});

/* ----------------- */
/* --- FUNCTIONS --- */
/* ----------------- */

function moveStartOrEnd(prevIndex, newIndex, startOrEnd) {
  var newCellY = newIndex % totalCols;
  var newCellX = Math.floor((newIndex - newCellY) / totalCols);
  if (startOrEnd == "start") {
    startCell = [newCellX, newCellY];
    console.log("Moving start to [" + newCellX + ", " + newCellY + "]");
  } else if (startOrEnd == "end") {
    endCell = [newCellX, newCellY];
    console.log("Moving end to [" + newCellX + ", " + newCellY + "]");
  } else if (startOrEnd == "end2") {
    endcell2 = [newCellX, newCellY];
    console.log("Moving end to [" + newCellX + ", " + newCellY + "]");
  }
  clearBoard((keepWalls = true));
  return;
}

function moveEnd(prevIndex, newIndex) {
  // Erase last end cell
  $($("td").find(prevIndex)).removeClass();

  var newEnd = $("td").find(newIndex);
  $(newEnd).removeClass();
  $(newEnd).addClass("end");

  var newEndX = Math.floor(newIndex / totalRows);
  var newEndY = Math.floor(newIndex / totalCols);
  startCell = [newStartX, newStartY];
  return;
}
function updateSpeedDisplay() {
  if (animationSpeed == "Slow") {
    $(".speedDisplay").text("Speed: Slow");
  } else if (animationSpeed == "Normal") {
    $(".speedDisplay").text("Speed: Normal");
  } else if (animationSpeed == "Fast") {
    $(".speedDisplay").text("Speed: Fast");
  }
  return;
}

function updateStartBtnText() {
  if (algorithm == "Depth-First Search (DFS)") {
    $("#startBtn").html("Start DFS");
  } else if (algorithm == "Breadth-First Search (BFS)") {
    $("#startBtn").html("Start BFS");
  } else if (algorithm == "Dijkstra") {
    $("#startBtn").html("Start Dijkstra");
  } else if (algorithm == "A*") {
    $("#startBtn").html("Start A*");
  } else if (algorithm == "Greedy Best-First Search") {
    $("#startBtn").html("Start Greedy BFS");
  } else if (algorithm == "Jump Point Search") {
    $("#startBtn").html("Start JPS");
  } else if (algorithm == "Bidirectional Best First Search") {
    $("#startBtn").html("Start Bi BFS");
  } else if (algorithm == "Bidirectional Breadth First Search") {
    $("#startBtn").html("Bidirectional Breadth First Search");
  } else if (algorithm == "Bidirectional A*") {
    $("#startBtn").html("Start Bidirectional A*");
    return;
  } else if (algorithm == "Bidirectional Dijkstra") {
    $("#startBtn").html("Start Bidirectional Dijkstra");
    return;
  } else if (algorithm == "Bidirectional Best First Search") {
    $("#startBtn").html("Start Bi Best First Search");
    return;
  } else if (algorithm == "IDA*") {
    $("#startBtn").html("Start IDA*");
  } else if (algorithm == "Trace") {
    $("#startBtn").html("Start Trace");
  }
}

// Used to display error messages
function update(message) {
  $("#resultsIcon").removeClass();
  $("#resultsIcon").addClass("fas fa-exclamation");
  $("#results").css("background-color", "#ffc107");
  $("#length").text("");
  if (message == "wait") {
    $("#duration").text("Please wait for the algorithm to finish.");
  }
}

// Used to display results
function updateResults(duration, pathFound, length) {
  var firstAnimation = "swashOut";
  var secondAnimation = "swashIn";
  $("#results").removeClass();
  $("#results").addClass("magictime " + firstAnimation);
  setTimeout(function () {
    $("#resultsIcon").removeClass();
    //$("#results").css("height","80px");
    if (pathFound) {
      $("#results").css("background-color", "#77dd77");
      $("#resultsIcon").addClass("fas fa-check");
    } else {
      $("#results").css("background-color", "#ff6961");
      $("#resultsIcon").addClass("fas fa-times");
    }
    $("#duration").text("Duration: " + duration + "ms");
    $("#length").text("Length: " + length);
    $("#results").removeClass(firstAnimation);
    $("#results").addClass(secondAnimation);
  }, 1100);
}

// Counts length of success
function countLength() {
  var cells = $("td");
  var l = 0;
  for (var i = 0; i < cells.length; i++) {
    if ($(cells[i]).hasClass("success")) {
      l++;
    }
  }
  return l;
}

async function traverseGraph(algorithm) {
  inProgress = true;
  clearBoard((keepWalls = true));
  var startTime = Date.now();
  var pathFound = executeAlgo();
  var endTime = Date.now();
  await animateCells();
  if (pathFound) {
    updateResults(endTime - startTime, true, countLength());
  } else {
    updateResults(endTime - startTime, false, countLength());
  }
  inProgress = false;
  justFinished = true;
}

function executeAlgo() {
  if (algorithm == "Depth-First Search (DFS)") {
    var visited = createVisited();
    var pathFound = DFS(startCell[0], startCell[1], visited);
  } else if (algorithm == "Breadth-First Search (BFS)") {
    var pathFound = BFS();
  } else if (algorithm == "Dijkstra") {
    var pathFound = dijkstra();
  } else if (algorithm == "A*") {
    var pathFound = AStar(heuristic, weight);
  } else if (algorithm == "Greedy Best-First Search") {
    var pathFound = greedyBestFirstSearch(heuristic);
  } else if (algorithm == "Jump Point Search") {
    var pathFound = jumpPointSearch(heuristic);
  } else if (algorithm == "Bidirectional Breadth First Search") {
    var pathFound = BiBreadthFS();
  } else if (algorithm == "Bidirectional A*") {
    var pathFound = biAStar(heuristic, weight);
  } else if (algorithm == "Bidirectional Dijkstra") {
    var pathFound = bidijkstra();
  } else if (algorithm == "Bidirectional Best First Search") {
    var pathFound = bibestfs(heuristic);
  } else if (algorithm == "IDA*") {
    heuristic = "Manhattan";
    var pathFound = idastar(heuristic);
  } else if (algorithm == "Trace") {
    var pathFound = trace();
  }
  return pathFound;
}

function makeWall(cell) {
  if (!createWalls) {
    return;
  }
  var index = $("td").index(cell);
  var row = Math.floor(index / totalRows) + 1;
  var col = (index % totalCols) + 1;
  console.log([row, col]);
  if (
    inProgress == false &&
    !(row == 1 && col == 1) &&
    !(row == totalRows && col == totalCols)
  ) {
    $(cell).toggleClass("wall");
  }
}

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

function cellIsAWall(i, j, cells) {
  var cellNum = i * totalCols + j;
  return $(cells[cellNum]).hasClass("wall");
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
function path(pathFound, k, prev) {
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
function bipath(pathFound, f, i, j, l, k, prev, prev1, prev2) {
  if (pathFound == true) {
    //console.log(i);
    //console.log(j);
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

/* ----------------- */
/* --- ALGORITHMS --- */
/* ----------------- */

/*Depth First Search*/

function DFS(i, j, visited) {
  if (
    (i == endCell[0] && j == endCell[1]) ||
    (i == endcell2[0] && j == endcell2[1])
  ) {
    cellsToAnimate.push([[i, j], "success"]);
    return true;
  }
  visited[i][j] = true;
  cellsToAnimate.push([[i, j], "searching"]);
  var neighbors = getNeighbors(i, j);
  for (var k = 0; k < neighbors.length; k++) {
    var m = neighbors[k][0];
    var n = neighbors[k][1];
    if (!visited[m][n]) {
      var pathFound = DFS(m, n, visited);
      if (pathFound) {
        cellsToAnimate.push([[i, j], "success"]);
        return true;
      }
    }
  }
  cellsToAnimate.push([[i, j], "visited"]);
  return false;
}

/*Breadth First Search*/
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
  return path(pathFound, k, prev);
}

/*Bidirectional Breadth First Search*/
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
  var arr = new Array(totalRows);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
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
    var neighbors = getNeighbors_ifdiag(r, c); //get neighbours
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];

      if (visited[m][n]) {
        //if the neighbour already visited continue
        continue;
      }
      if (!visited[m][n]) {
        if (arr[m][n] == By_end) {
          //if the neighbour was visited by first end cell
          pathFound = true;
          var i = r; //store the position of the cell
          var j = c;
          var l = m; //store the position of the neighbour
          var k = n;
          f = 0; //if first end cell was found
          //console.log("break1");
          break;
        }
        if (arr[m][n] == By_end2) {
          //if the neighbour was visited by second end cell
          pathFound = true;
          var i = r; //store the position of the cell
          var j = c;
          var l = m; //store the position of the neighbour
          var k = n;
          f = 2; //if second endcell was found
          //console.log("break4");
          break;
        }
        visited[m][n] = true; //set the neighbour as visited
        prev[m][n] = [r, c];
        cellsToAnimate.push([neighbors[k], "searching"]);
        myQueue.enqueue(neighbors[k]); //add the neighbbour to the queue
        arr[m][n] = By_start;
      }
    }
    /*if the start cell found the first end cell or second end cell then break out oif the loop*/
    if (f == 0 || f == 2) {
      break;
    }
    if (!Q1.empty()) {
      var cell = Q1.dequeue();
      var r = cell[0];
      var c = cell[1];
      cellsToAnimate.push([cell, "visited"]);
      var neighbors = getNeighbors_ifdiag(r, c);
      for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];

        if (visited1[m][n]) {
          continue;
        }
        if (!visited1[m][n]) {
          if (arr[m][n] == By_start) {
            //if the neighbour was visited by start cell
            pathFound = true;
            var i = r;
            var j = c;
            var l = m;
            var k = n;
            var f = 1;
            //console.log("Break2");
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
      var neighbors = getNeighbors_ifdiag(r, c);
      for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];

        if (visited2[m][n]) {
          continue;
        }
        if (!visited2[m][n]) {
          if (arr[m][n] == By_start) {
            //if the neighbour was visited by start cell
            pathFound = true;
            var i = r;
            var j = c;
            var l = m;
            var k = n;
            var f = 3;
            //console.log("Break3");
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
  return bipath(pathFound, f, i, j, l, k, prev, prev1, prev2);
}
/*Dijkstra*/
function dijkstra() {
  var pathFound = false;
  var myHeap = new minHeap();
  var prev = createPrev();
  var distances = createDistances();
  var visited = createVisited();
  var k = -1;
  distances[startCell[0]][startCell[1]] = 0; //set the distance of start cell to 0
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
      k = 0; //if end cell 1 was found
      pathFound = true;
      break;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      k = 1; //if end cell 2 was found
      pathFound = true;
      break;
    }
    var neighbors = getNeighbors_ifdiag(i, j);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }

      var newDistance =
        distances[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        myHeap.push([newDistance, [m, n]]);
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
  return path(pathFound, k, prev);
}
/*Bidirectional Dijkstra*/
function bidijkstra() {
  var pathFound = false;
  var myHeap = new minHeap();
  var Heap1 = new minHeap();
  var Heap2 = new minHeap();
  var prev = createPrev();
  var prev1 = createPrev();
  var prev2 = createPrev();
  var distances = createDistances();
  var distances1 = createDistances();
  var distances2 = createDistances();
  var visited = createVisited();
  var visited1 = createVisited();
  var visited2 = createVisited();
  var f = -1;
  var By_start = 0;
  var By_end = 1;
  var By_end2 = 2;
  distances[startCell[0]][startCell[1]] = 0;
  distances1[endCell[0]][endCell[1]] = 0;
  distances2[endcell2[0]][endcell2[1]] = 0;
  myHeap.push([0, [startCell[0], startCell[1]]]);
  Heap1.push([0, [endCell[0], endCell[1]]]);
  Heap2.push([0, [endcell2[0], endcell2[1]]]);
  cellsToAnimate.push([[startCell[0], startCell[1]], "searching"]);
  cellsToAnimate.push([[endCell[0], endCell[1]], "searching"]);
  cellsToAnimate.push([[endcell2[0], endcell2[1]], "searching"]);
  visited[startCell[0]][startCell[1]] = true;
  visited1[endCell[0]][endCell[1]] = true;
  visited2[endcell2[0]][endcell2[1]] = true;
  var arr = new Array(totalRows);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
  arr[startCell] = By_start;
  arr[endCell] = By_end;
  arr[endcell2] = By_end2;

  while (!myHeap.isEmpty() || (!Heap1.isEmpty() && !Heap2.isEmpty())) {
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
        //console.log("break1");
        break;
      }
      if (arr[m][n] == By_end2) {
        //if the node is already visited by second end
        pathFound = true;
        var p = i; //store the position of the cell
        var q = j;
        var l = m; //store the position of the neighbour
        var k = n;
        f = 2;
        //console.log("break4");
        break;
      }
      visited[m][n] = true;
      var newDistance =
        distances[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        myHeap.push([newDistance, [m, n]]);
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
        if (visited[m][n]) {
          continue;
        }
        if (arr[m][n] == By_start) {
          //if the node is already visited by first end
          pathFound = true;
          var p = i; //store the position of the cell
          var q = j;
          var l = m; //store the position of the neighbour
          var k = n;
          f = 1;
          //console.log("break///");
          break;
        }
        visited1[m][n] = true;
        var newDistance =
          distances1[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
        if (newDistance < distances1[m][n]) {
          distances1[m][n] = newDistance;
          prev1[m][n] = [i, j];
          Heap1.push([newDistance, [m, n]]);
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
          var p = i; //store the position of the cell
          var q = j;
          var l = m; //store the position of the neighbour
          var k = n;
          f = 3;
          //console.log("break3");
          break;
        }
        visited2[m][n] = true;
        var newDistance =
          distances2[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
        if (newDistance < distances2[m][n]) {
          distances2[m][n] = newDistance;
          prev2[m][n] = [i, j];
          Heap2.push([newDistance, [m, n]]);
          cellsToAnimate.push([[m, n], "searching"]);
          arr[m][n] = By_end2;
        }
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
  return bipath(pathFound, f, p, q, l, k, prev, prev1, prev2);
}
/*Astar */
function AStar(heuristic, weight) {
  var pathFound = false;
  var myHeap = new minHeap();
  var prev = createPrev();
  var distances = createDistances();
  var costs = createDistances();
  var visited = createVisited();
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
      k = 0;
      pathFound = true;
      break;
    }
    if (i == endcell2[0] && j == endcell2[1]) {
      k = 1;
      pathFound = true;
      break;
    }
    var neighbors = getNeighbors_ifdiag(i, j);
    for (var k = 0; k < neighbors.length; k++) {
      var m = neighbors[k][0];
      var n = neighbors[k][1];
      if (visited[m][n]) {
        continue;
      }
      var newDistance =
        distances[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        cellsToAnimate.push([[m, n], "searching"]);
      }
      var newCost =
        distances[i][j] +
        weight * findheuristics(heuristic, endCell[0], endCell[1], m, n);
      console.log(weight);

      if (newCost < costs[m][n]) {
        costs[m][n] = newCost;
        myHeap.push([newCost, [m, n]]);
      }
      var nc =
        distances[i][j] +
        weight * findheuristics(heuristic, endcell2[0], endcell2[1], m, n);
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
  return path(pathFound, k, prev);
}
/*Bidirectional Astar*/
function biAStar(heuristic, weight) {
  var pathFound = false;
  var myHeap = new minHeap();
  var Heap1 = new minHeap();
  var Heap2 = new minHeap();
  var prev = createPrev();
  var prev1 = createPrev();
  var prev2 = createPrev();
  var distances = createDistances();
  var distances1 = createDistances();
  var distances2 = createDistances();
  var costs = createDistances();
  var costs1 = createDistances();
  var costs2 = createDistances();
  var visited = createVisited();
  var visited1 = createVisited();
  var visited2 = createVisited();
  var By_start = 0;
  var By_end = 1;
  var By_end2 = 2;
  var f = -1;
  distances[startCell[0]][startCell[1]] = 0;
  distances1[endCell[0]][endCell[1]] = 0;
  distances2[endcell2[0]][endcell2[1]] = 0;
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
  visited[startCell[0]][startCell[1]] = true;
  visited1[endCell[0]][endCell[1]] = true;
  visited2[endcell2[0]][endcell2[1]] = true;
  arr[startCell] = By_start;
  arr[endCell] = By_end;
  arr[endcell2] = By_end2;

  while (!myHeap.isEmpty() && (!Heap1.isEmpty() || !Heap2.isEmpty())) {
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
      var newDistance =
        distances[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
      if (newDistance < distances[m][n]) {
        distances[m][n] = newDistance;
        prev[m][n] = [i, j];
        cellsToAnimate.push([[m, n], "searching"]);
      }
      var newCost =
        distances[i][j] +
        weight * findheuristics(heuristic, endCell[0], endCell[1], m, n);
      //console.log(weight);

      if (newCost < costs[m][n]) {
        costs[m][n] = newCost;
        myHeap.push([newCost, [m, n]]);
      }
      var nc =
        distances[i][j] +
        weight * findheuristics(heuristic, endcell2[0], endcell2[1], m, n);
      if (nc < costs[m][n]) {
        costs[m][n] = nc;
        myHeap.push([nc, [m, n]]);
      }
      arr[m][n] = By_start;
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
          //if the node is already visited by the start node
          pathFound = true;
          var p = i;
          var q = j;
          var l = m;
          var k = n;
          f = 1;
          console.log("break2");
          break;
        }
        var newDistance =
          distances1[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2
        if (newDistance < distances1[m][n]) {
          distances1[m][n] = newDistance;
          prev1[m][n] = [i, j];
          cellsToAnimate.push([[m, n], "searching"]);
        }
        var newCost =
          distances1[i][j] +
          weight * findheuristics(heuristic, startCell[0], startCell[1], m, n);
        //console.log(weight);

        if (newCost < costs1[m][n]) {
          costs1[m][n] = newCost;
          Heap1.push([newCost, [m, n]]);
        }
        arr[m][n] = By_end;
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
          //if the node is already visited by start node
          pathFound = true;
          var p = i;
          var q = j;
          var l = m;
          var k = n;
          f = 3;
          console.log("break,,,");
          break;
        }
        var newDistance =
          distances2[i][j] + (m - i === 0 || n - i === 0 ? 1 : Math.SQRT2); //if diagonal neighbour add distance as root 2

        if (newDistance < distances2[m][n]) {
          distances2[m][n] = newDistance;
          prev2[m][n] = [i, j];
          cellsToAnimate.push([[m, n], "searching"]);
        }
        var newCost =
          distances2[i][j] +
          weight * findheuristics(heuristic, startCell[0], startCell[1], m, n);
        //console.log(weight);

        if (newCost < costs2[m][n]) {
          costs2[m][n] = newCost;
          Heap2.push([newCost, [m, n]]);
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
  return bipath(pathFound, f, p, q, l, k, prev, prev1, prev2);
}

/*Jump Point search*/
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
      if ((endCell[0] == i || endCell[1] == c) && !stored[xy]) {
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
/*Best First Search*/
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

  return path(pathFound, k, prev);
}
/*Bidirectional best first Search*/
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
  return bipath(pathFound, f, p, q, l, k, prev, prev1, prev2);
}
/*Idastar*/
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
    //console.log("First cell loop");
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
  if (pathFound1) {
    return pathFound1;
  } else {
    return pathFound2;
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
/*Trace*/
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
  return path(pathFound, k, prev);
}
/* ----------------- */
/* --- MAZES --- */
/* ----------------- */
/*Random Maze*/
async function randomMaze() {
  1;
  inProgress = true;
  clearBoard((keepWalls = false));
  var visited = createVisited();
  var walls = makeWalls();
  var cells = [startCell, endCell, endcell2];
  walls[startCell[0]][startCell[1]] = false;
  walls[endCell[0]][endCell[1]] = false;
  walls[endcell2[0]][endcell2[1]] = false;
  visited[startCell[0]][startCell[1]] = true;
  visited[endCell[0]][endCell[1]] = true;
  visited[endcell2[0]][endcell2[1]] = true;
  while (cells.length > 0) {
    var random = Math.floor(Math.random() * cells.length);
    var randomCell = cells[random];
    cells[random] = cells[cells.length - 1];
    cells.pop();
    var neighbors = getNeighbors(randomCell[0], randomCell[1]);
    if (neighborsThatAreWalls(neighbors, walls) < 2) {
      continue;
    }
    walls[randomCell[0]][randomCell[1]] = false;
    for (var k = 0; k < neighbors.length; k++) {
      var i = neighbors[k][0];
      var j = neighbors[k][1];
      if (visited[i][j]) {
        continue;
      }
      visited[i][j] = true;
      cells.push([i, j]);
    }
  }
  //Animate cells
  var cells = $("#tableContainer").find("td");
  for (var i = 0; i < totalRows; i++) {
    for (var j = 0; j < totalCols; j++) {
      if (
        i == 0 ||
        i == totalRows - 1 ||
        j == 0 ||
        j == totalCols - 1 ||
        walls[i][j]
      ) {
        cellsToAnimate.push([[i, j], "wall"]);
      }
    }
  }
  await animateCells();
  inProgress = false;
  return;
}
/*Spiral Maze*/
async function spiralMaze() {
  inProgress = true;
  clearBoard((keepWalls = false));

  var length = 1;
  var direction = {
    "0": [-1, 1], //northeast
    "1": [1, 1], //southeast
    "2": [1, -1], //southwest
    "3": [-1, -1], //northwest
  };
  var cell = [Math.floor(totalRows / 2), Math.floor(totalCols / 2)];
  while (inBounds(cell)) {
    var i_increment = direction[length % 4][0];
    var j_increment = direction[length % 4][1];
    for (var count = 0; count < length; count++) {
      var i = cell[0];
      var j = cell[1];
      cellsToAnimate.push([[i, j], "wall"]);
      cell[0] += i_increment;
      cell[1] += j_increment;
      if (!inBounds(cell)) {
        break;
      }
    }
    length += 1;
  }
  await animateCells();
  inProgress = false;
  return;
}

function inBounds(cell) {
  return (
    cell[0] >= 0 && cell[1] >= 0 && cell[0] < totalRows && cell[1] < totalCols
  );
}
/*Recursive Division*/
async function recursiveDivMaze(bias) {
  inProgress = true;
  clearBoard((keepWalls = false));

  //Animate edge walls
  for (var i = 0; i < totalRows; i++) {
    for (var j = 0; j < totalCols; j++) {
      if (i == 0 || j == 0 || i == totalRows - 1 || j == totalCols - 1) {
        cellsToAnimate.push([[i, j], "wall"]);
      }
    }
  }

  var walls = createVisited();
  var passages = createVisited();
  recursiveDivMazeHelper(
    1,
    totalRows - 2,
    1,
    totalCols - 2,
    2,
    totalRows - 3,
    2,
    totalCols - 3,
    walls,
    passages,
    bias
  );
  await animateCells();
  inProgress = false;
  return;
}

function recursiveDivMazeHelper(
  iStart,
  iEnd,
  jStart,
  jEnd,
  horzStart,
  horzEnd,
  vertStart,
  vertEnd,
  walls,
  passages,
  bias
) {
  var height = iEnd - iStart + 1;
  var width = jEnd - jStart + 1;
  var canMakeVertWall = vertEnd - vertStart >= 0;
  var canMakeHorzWall = horzEnd - horzStart >= 0;
  if (height < 3 || width < 3 || !canMakeVertWall | !canMakeHorzWall) {
    return;
  }
  // Choose line orientation
  var x = Math.floor(Math.random() * 10);
  if (bias == "VERTICAL") {
    var lineOrientation = x < 8 ? "VERTICAL" : "HORIZONTAL"; // weighting: 90/10 (V/H)
  } else if (bias == "HORIZONTAL") {
    var lineOrientation = x < 1 ? "VERTICAL" : "HORIZONTAL"; // weighting: 10/90 (V/H)
  } else {
    var lineOrientation = x < 5 ? "VERTICAL" : "HORIZONTAL"; // weighting: 50/50 (V/H)
  }

  // Draw line and create random passage
  if (lineOrientation == "VERTICAL") {
    var vertWidth = vertEnd - vertStart + 1;
    var randCol = Math.floor(Math.random() * vertWidth) + vertStart;
    if (passages[iStart][randCol]) {
      var randRow = iStart;
    } else if (passages[iEnd][randCol]) {
      var randRow = iEnd;
    } else {
      var randRow = Math.floor(Math.random() * 2) == 0 ? iStart : iEnd; // random end assignment
      //var randRow = Math.floor(Math.random() * height) + iStart; // random parition
    }
    for (var i = iStart; i <= iEnd; i++) {
      if (passages[i][randCol]) {
        continue;
      }
      if (i == randRow) {
        // Make passages
        for (var j = randCol - 1; j <= randCol + 1; j++) {
          passages[i][j] = true;
        }
      } else {
        walls[i][randCol] = true;
        cellsToAnimate.push([[i, randCol], "wall"]);
      }
    }
    recursiveDivMazeHelper(
      iStart,
      iEnd,
      jStart,
      randCol - 1,
      horzStart,
      horzEnd,
      vertStart,
      randCol - 2,
      walls,
      passages
    ); //left
    recursiveDivMazeHelper(
      iStart,
      iEnd,
      randCol + 1,
      jEnd,
      horzStart,
      horzEnd,
      randCol + 2,
      vertEnd,
      walls,
      passages
    ); //right
  } else {
    var horzHeight = horzEnd - horzStart + 1;
    var randRow = Math.floor(Math.random() * horzHeight) + horzStart;
    if (passages[randRow][jStart]) {
      var randCol = jStart;
    } else if (passages[randRow][jEnd]) {
      var randCol = jEnd;
    } else {
      var randCol = Math.floor(Math.random() * 2) == 0 ? jStart : jEnd; // random end assignment
    }
    for (var j = jStart; j <= jEnd; j++) {
      if (passages[randRow][j]) {
        continue;
      }
      if (j == randCol) {
        // Make passages
        for (var i = randRow - 1; i <= randRow + 1; i++) {
          passages[i][j] = true;
        }
      } else {
        walls[randRow][j] = true;
        cellsToAnimate.push([[randRow, j], "wall"]);
      }
    }
    recursiveDivMazeHelper(
      iStart,
      randRow - 1,
      jStart,
      jEnd,
      horzStart,
      randRow - 2,
      vertStart,
      vertEnd,
      walls,
      passages
    ); //up
    recursiveDivMazeHelper(
      randRow + 1,
      iEnd,
      jStart,
      jEnd,
      randRow + 2,
      horzEnd,
      vertStart,
      vertEnd,
      walls,
      passages
    ); //down
  }
  return;
}

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

function neighborsThatAreWalls(neighbors, walls) {
  var neighboringWalls = 0;
  for (var k = 0; k < neighbors.length; k++) {
    var i = neighbors[k][0];
    var j = neighbors[k][1];
    if (walls[i][j]) {
      neighboringWalls++;
    }
  }
  return neighboringWalls;
}

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
function getNeighbors_ifdiag(i, j) {
  var neighbors = [];
  var visited = createVisited();
  if (i > 0 && visited[i - 1][j] == false) {
    var n0 = true;
    neighbors.push([i - 1, j]);
  }
  if (j > 0 && visited[i][j - 1] == false) {
    var n1 = true;
    neighbors.push([i, j - 1]);
  }
  if (i < totalRows - 1 && visited[i + 1][j] == false) {
    var n2 = true;
    neighbors.push([i + 1, j]);
  }
  if (j < totalCols - 1 && visited[i][j + 1] == false) {
    var n3 = true;
    neighbors.push([i, j + 1]);
  }
  if (allow_diag == true && dont_cross_corners == false) {
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
  if (dont_cross_corners == true && allow_diag == true) {
    if (i > 0 && j > 0 && (n0 === true || n1 == true)) {
      neighbors.push([i - 1, j - 1]);
    }
    if (i > 0 && j < totalCols - 1 && (n0 == true || n3 == true)) {
      neighbors.push([i - 1, j + 1]);
    }
    if (i < totalRows - 1 && j < totalCols - 1 && (n2 == true || n3 == true)) {
      neighbors.push([i + 1, j + 1]);
    }
    if (i < totalRows - 1 && j > 0 && (n1 == true || n2 == true)) {
      neighbors.push([i + 1, j - 1]);
    }
  }
  return neighbors;
}

async function animateCells() {
  //console.log("Animate cells");
  animationState = null;
  var cells = $("#tableContainer").find("td");
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  var endcellindex2 = endcell2[0] * totalCols + endcell2[1];
  var delay = getDelay();
  //console.log(cellsToAnimate);
  for (var i = 0; i < cellsToAnimate.length; i++) {
    var cellCoordinates = cellsToAnimate[i][0];
    var x = cellCoordinates[0];
    var y = cellCoordinates[1];
    var num = x * totalCols + y;
    if (num == startCellIndex || num == endCellIndex || num == endcellindex2) {
      continue;
    }
    var cell = cells[num];
    var colorClass = cellsToAnimate[i][1];

    // Wait until its time to animate
    await new Promise((resolve) => setTimeout(resolve, delay));

    $(cell).removeClass();
    $(cell).addClass(colorClass);
  }
  cellsToAnimate = [];
  //console.log("End of animation has been reached!");
  return new Promise((resolve) => resolve(true));
}

function getDelay() {
  var delay;
  if (animationSpeed === "Slow") {
    if (algorithm == "Depth-First Search (DFS)") {
      delay = 25;
    } else {
      delay = 20;
    }
  } else if (animationSpeed === "Normal") {
    if (algorithm == "Depth-First Search (DFS)") {
      delay = 15;
    } else {
      delay = 10;
    }
  } else if (animationSpeed == "Fast") {
    if (algorithm == "Depth-First Search (DFS)") {
      delay = 10;
    } else {
      delay = 5;
    }
  }
  console.log("Delay = " + delay);
  return delay;
}

function clearBoard(keepWalls) {
  var cells = $("#tableContainer").find("td");
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  var endcellindex2 = endcell2[0] * totalCols + endcell2[1];
  for (var i = 0; i < cells.length; i++) {
    isWall = $(cells[i]).hasClass("wall");
    $(cells[i]).removeClass();
    if (i == startCellIndex) {
      $(cells[i]).addClass("start");
    } else if (i == endCellIndex) {
      $(cells[i]).addClass("end");
    } else if (keepWalls && isWall) {
      $(cells[i]).addClass("wall");
    } else if (i == endcellindex2) {
      $(cells[i]).addClass("end2");
    }
  }
}

// Ending statements
clearBoard();
