# Minesweeper

### Objective of the game

The player must guess the position of all the bombs, without touching them.
Hints about the position of the bombs are given to the player whenever a non-bomb tile is revealed.
A revealed non-bomb tile will display the number of bombs among adjacent tiles.

> Example: a revealed non-bomb tile displaying the number 2 means that there are 2 bombs among the adjacent tiles.

If the player reveals a bomb the **game is lost.**

If the player manages to correcly identify the position of all the bombs the **game is won.**

## Wireframe



## Pseucode

### Pre-Game Activities

- The player selects the difficlty of the game (dimensions of the board, number of bombs).

- The board is rendered based on the dimension chosen by the player.

- A grid object is initialized to mirror the rendered board.

- A function randomizes the position of the bombs and assigns the bombs to the corresponding elements of the grid.

- A function assigns a numerical value to each non-bomb elements of the grid based on the number of bombs in the adjacent elements.

### Game

- The game start whenever a player right-clicks or left-clicks a tile on the board


- If the player right-clicks an unrevealed tile of the board:
    - A flag is displayed as the content of the tile.

    
- If the player right-clicks a flag-tile on the board:
    - The flag is removed from the tile. The tile will display the default look.

    
- If a player left-clicks an unrevealed tile or a flag-tile of the board:

    - If the corresponding element of the grid is a bomb-element:
        - The tile is revealed showing a bomb.
        - All the bomb-tiles are revealed showing bombs.
        - **The game is lost.**

    - If the corresponding element of the grid is a non-0-number-elemnt:
        - the tile is revealed showing the number

    - If the corresponding element of the grid is a 0-number-element:
        - the tile is revealed showing the number
        - all the adjacents grid elements are checked:
            - if it's a non-0-number-elemnt: reveal the corresponding tile
            - if it's 0-number-element: reveal the corresponding tile and add the adjacent grid elements to be checked.


- If a player flags every tile corrisponding to bomb-elements in the grid:
    - **the game is won.**

- As the game ends a button will pop-up to reset the game.

### Possible Add-ons

- Timer to keep track of the time to win the game.
- Scoreboard with prompt asking player name.