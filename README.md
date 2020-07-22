# Path Finding Visualizer Team-The Mars Hackers

Our aim of the project is to build a Web-App to help a Mars Rover to find the shortest path .

This project is inspired by [Pathfinding.js](https://github.com/qiao/PathFinding.js/)

## Algorithms used to find the path:

**Astar** : It is a weighted algorithm that uses heuristic functions to find the shortest path. A* works by making a lowest-cost path tree from the start node to the target node. What makes A* different and better for many searches is that for each node, Astar uses a function f(n) that gives an estimate of the total cost of a path using that node.It uses a heap for implementation.

**Best First Search** : It is an unweighted algorithm.It is the combination of depth-first search and breadth-first search algorithms. It uses the heuristic function and search.

**Breadth First Search** : It starts at the start node, and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.

**Depth First Search** : The DFS algorithm is a recursive algorithm that uses the idea of backtracking. It involves exhaustive searches of all the nodes by going ahead, if possible, else by backtracking.

**Dijkstra** : It is an unweighted search algorithm.It picks the unvisited vertex with the lowest distance, calculates the distance through it to each unvisited neighbor, and updates the neighbor's distance if smaller.

**IDAstar** :

**Jump Point Search**

**Trace** : Trace algorithm is similar to Astar algorithm. The only difference is instead of weight the heuristic is multiflied by a function which is less than 1.

## Diagonal

The pathfinding visualizer supports both diagonal and non diagonal pathfinding.

Simply check the "Allow Diagonal" .

## Speed

You can change the speed of the visualization during runtime.

By default the speed is set to "Fast".

## Don't cross corners

You can choose whether to cross corners of two blocked nodes (nodes with walls).

This option only works if Allow Diagonal option is checked.

## Bidirectional Searches

Bidirectional Search, as the name implies, searches in two directions at the same time: one forward from the initial state and the other backward from the goal.The search stops when searches from both directions meet in the middle.

This project consists of th following bidirectional searches:

Astar

Dijkstra

Best first search

Breadth First Search

## Mazes

**Random**

**Recursive Division**

**Recursive Division(Vertical Skew)**

**Recursive Division(Horizontal Skew)**

**Spiral**
