// Description: This is collection of heurisitc functions.

module.exports = {

    // (number) dx = difference in x
    // (number) dy = difference in y

    //MANHATTAN DISTANCE : If your map allows 4 directions of movement.
    manhattan: function(dx, dy) {
        return dx + dy;
    },

    //This one is for if D is the cost of movement. Decide which one to use finally depending on how we create nodes and all.
    manhattan_node: function(node) {
        dx = abs(node.x - goal.x);
        dy = abs(node.y - goal.y);
        return D * (dx + dy);
    },

    //EUCLEDIAN DISTANCE : If your units can move at any angle (instead of grid directions)
    eucledian: function(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    },

    //DIAGONAL DISTANCE : If your map allows diagonal movement (Total - 8 directions of movement).
    // COMPLETE: Here, cost of moving side or up/down is D, and cost for moving diagonally is D2.
    diagonal_node: function(node) {
        dx = abs(node.x - goal.x);
        dy = abs(node.y - goal.y);
        return D * (dx + dy) + (D2 - 2 * D) * min(dx, dy);
    },

    //1. CHEBYSHEV DISTANCE : If D = 1 and D2 = 1
    chebyshev: function(dx, dy) {
        return Math.max(dx, dy);
    },

    //2. OCTILE DISTANCE : If D = 1 and D2 = sqrt(2)
    octile: function(dx, dy) {
        return Math.max(dx, dy) + (Math.SQRT(2) - 1) * Math.min(dx, dy);
    }

};