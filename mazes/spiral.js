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
