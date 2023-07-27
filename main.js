/*----- app's state (variables) -----*/

const begBoard = [9, 9, 10]
const intBoard = [16, 16, 40]
const expBoard = [30, 16, 99]
let bombsIdx
let vIdx
let board
let grid
let victoryGrid
let unsortedBombsIdx
let clock
let firstClick


/*----- cached element references -----*/


boardEl = document.querySelector(".board")

selectLevelBtnEls = document.querySelectorAll(".levelBtn")

resetBtnEl = document.getElementById("reset")

bombCounterEl = document.getElementById("bCounter")
flagCounterEl = document.getElementById("fCounter")

clockEl = document.getElementById("clock")

/*----- event listeners -----*/


for (btn of selectLevelBtnEls) {
    btn.addEventListener("click", defineBoard)
}

boardEl.addEventListener("click", clickTile)
boardEl.addEventListener("contextmenu", rightClickTile)
boardEl.addEventListener("mouseover", overTile)
boardEl.addEventListener("mouseout", overTile)

resetBtnEl.addEventListener("click", init)


/*----- functions -----*/


// initialize the game variables, render the board.
function init() {

    boardEl.addEventListener("click", clickTile)
    boardEl.addEventListener("contextmenu", rightClickTile)
    boardEl.classList.remove("bomb")
    boardEl.classList.remove("win")

    clearInterval(clock)
    clockEl.innerText = "000"

    flagCounterEl.innerText = 0

    bombsIdx = []
    unsortedBombsIdx = []
    vIdx = []
    firstClick = true

    createBoard()
    grid = createGrid(0)
    victoryGrid = createGrid("v")

    bombCounterEl.innerText = board[2]
}

// based on the click of the player assign class value beginner/intermediate/expert to the element storing the baord.
function defineBoard(e) {

    boardEl.classList.remove("beginner")
    boardEl.classList.remove("intermediate")
    boardEl.classList.remove("expert")

    if (e.target.classList.contains("beg")) {
        boardEl.classList.add("beginner")
    } else if (e.target.classList.contains("int")) {
        boardEl.classList.add("intermediate")
    } else if (e.target.classList.contains("exp")) {
        boardEl.classList.add("expert")
    }

    init()
}

// ased on the class value of the element storing the board create the board in the dom appending button element to the board.
function createBoard() {

    deleteBoard()

    if (boardEl.classList.contains("beginner")) {
        board = begBoard
    } else if (boardEl.classList.contains("intermediate")) {
        board = intBoard
    } else if (boardEl.classList.contains("expert")) {
        board = expBoard
    }

    for (let i = 0; i < board[0] * board[1]; i++) {
        newBtn = document.createElement("button")
        newBtn.classList.add("gameTile")
        newBtn.setAttribute("id", `idx${i}`)
        boardEl.appendChild(newBtn)
    }
}

// remove every alement appended to the board.
function deleteBoard() {

    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.lastChild);
    }
}

// generate a "grid" array of value based on the selected board.
function createGrid(value) {

    let arr = []

    for (let i = 0; i < (board[0] * board[1]); i++) {
        arr.push(value)
    }

    return arr
}

// generate bombs position escluding the position of the first click, populate the grid with bombs and numbers, start the clock.
function startGame(idx){
    generateBombs(idx)
    placeBombs()
    populateGrid()
    startClock()

    firstClick = false
}

// randomize an array of numbers, representing indexes of the bombs, sort the array.
function generateBombs(idx) {

    while (bombsIdx.length < board[2]) {

        let bomb = Math.floor(Math.random() * board[0] * board[1])

        if (!bombsIdx.includes(bomb) && (bomb !==idx)){
            bombsIdx.push(bomb)
        }
    }

    unsortedBombsIdx = [...bombsIdx]

    bombsIdx.sort(function (a, b) {
        if (a > b) {
            return 1
        }
        return -1
    })
}

// in the game-grid array put "B" at the idexes of the bombs.
function placeBombs() {

    for (el of bombsIdx) {
        grid[el] = "B"
    }
}

// all checkGrid function to put numbers around bomb tile.
function populateGrid() {

    let arr = checkGrid(bombsIdx, true)

    for (el of arr) {
        if (grid[el] !== "B") {
            grid[el] = grid[el] + 1
        }
    }
}

// start and update the game clock
function startClock(){

    clock = setInterval(function () {
        clockEl.innerText = ("00" + (parseInt(clockEl.innerText)+1) ).slice(-3)
    },1000)
}

// given an array of numbers, return an array of numbers representing indexes of the tiles of the grid around the given array elements.
function checkGrid(arrOfIdx, boolean) {

    let arr = []

    for (el of arrOfIdx) {

        //row+1 col+0
        if (el + board[0] < board[0] * board[1]) {
            arr.push(el + board[0])
        }
        //row-1 col+0
        if (el - board[0] >= 0) {
            arr.push(el - board[0])
        }

        //row+0 col+1
        if (el + 1 < board[0] * board[1] && ((el + 1) % (board[0])) !== 0) {
            arr.push(el + 1)
        }
        //row+0 col-1
        if (el - 1 >= 0 && ((el % board[0]) !== 0)) {
            arr.push(el - 1)
        }


        if (boolean) {
            //row+1 col+1
            if (el + 1 + board[0] < board[0] * board[1] && ((el + 1) % board[0]) !== 0) {
                arr.push(el + board[0] + 1)
            }
            //row-1 col+1
            if (el + 1 - board[0] > 0 && ((el + 1) % board[0]) !== 0) {
                arr.push(el - board[0] + 1)
            }


            //row+1 col-1
            if (el - 1 + board[0] < board[0] * board[1] && (el % board[0]) !== 0) {
                arr.push(el + board[0] - 1)
            }
            //row-1 col-1
            if (el - 1 - board[0] >= 0 && (el % board[0]) !== 0) {
                arr.push(el - board[0] - 1)
            }
        }
    }
    return arr
}

// at mouseover or mouseout of a board tile toggle a class.
function overTile(e) {

    if (!e.target.classList.contains("gameTile")) {
        return
    }
    if (e.target.disabled) {
        return
    }
    if (e.target.classList.contains("rightclicked")) {
        return
    }

    e.target.classList.toggle("over")
}

/**
* at rightclick of a board tile:
* if it's the first click call the startGame function.
* each rightclick of cycles between flag - question mark - default
* update flag counter
*/
function rightClickTile(e) {

    e.preventDefault()

    if (!e.target.classList.contains("gameTile")) {
        return
    }
    if (e.target.disabled) {
        return
    }

    let idx = parseInt(e.target.getAttribute("id").slice(3))

    if (firstClick) {
        startGame(idx)
    }

    e.target.classList.add("rightclicked")

    if (e.target.dataset.value === "F") {
        e.target.innerText = "?"
        e.target.classList.remove("flag")
        e.target.setAttribute("data-value", "?")

    } else if (e.target.dataset.value === "?") {
        e.target.innerText = ""
        e.target.setAttribute("data-value", "")
        e.target.classList.remove("rightclicked")

    } else {
        e.target.classList.add("flag")
        e.target.setAttribute("data-value", "F")
    }
    updateCounter()
}

/**
* at click of a board tile:
* if it's the first click call the startGame function.
* if the tile is a bomb -> call revealbomb function.
* if the tile is a number !0 -> reveal the tile. put the value of the element in the victry-grid. call the colorNum function.
* if the tile is a 0 -> call the checkGrid on that number, iterate for every 0 found by checkGrid. put value of the element in the victory-grid.
* call checkWin function, update flag counter.
*/
function clickTile(e) {

    if (!e.target.classList.contains("gameTile")) {
        return
    }
    if (e.target.disabled) {
        return
    }

    let idx = parseInt(e.target.getAttribute("id").slice(3))

    if (firstClick) {
        startGame(idx)
    }

    e.target.disabled = true
    e.target.classList.add("clicked")
    e.target.classList.remove("flag")

    if (grid[idx] === "B") {
        clearInterval(clock)
        boardEl.classList.add("bomb")
        boardEl.removeEventListener("click", clickTile)
        boardEl.removeEventListener("contextmenu", rightClickTile)

        revealBombs(e.target, idx)

    } else if (grid[idx] !== 0) {

        e.target.innerText = grid[idx]
        colorNum(e.target)
        victoryGrid[idx] = grid[idx]

    } else {

        victoryGrid[idx] = 0

        let checkIfReveal = checkGrid([idx], true)

        for (i = 0; i < checkIfReveal.length; i++) {

            let element = document.getElementById(`idx${checkIfReveal[i]}`)
            element.classList.add("clicked")
            element.classList.remove("flag")
            element.disabled = true

            if (grid[checkIfReveal[i]] !== 0) {

                element.innerText = grid[checkIfReveal[i]]
                colorNum(element)
                victoryGrid[[checkIfReveal[i]]] = grid[[checkIfReveal[i]]]

            } else {

                element.innerText = ""
                victoryGrid[[checkIfReveal[i]]] = 0

                for (el of checkGrid([checkIfReveal[i]], true)) {
                    if (!checkIfReveal.includes(el)) {
                        checkIfReveal.push(el)
                    }
                }

            }
        }
    }
    checkWin()
    updateCounter()
}

// assign a class to the tile based on the innertext.
function colorNum(el) {
    el.classList.add(`num${el.innerText}`)
}

// start a timer to call the append bomb function for every elements corresponing to the bombs-index array, starting with the clicked bomb.
function revealBombs(target, idx) {

    target.innerText = ""
    appendBomb(target)
    target.classList.remove("flag")
    target.classList.add("bomb")

    unsortedBombsIdx.splice(unsortedBombsIdx.indexOf(idx), 1)

    resetBtnEl.disabled = true
    for (el of selectLevelBtnEls) {
        el.disabled = true
    }

    let i = 0
    let j = 0

    let timer = setInterval(function () {

        let tile = document.getElementById(`idx${unsortedBombsIdx[i]}`)

        tile.innerText = ""
        appendBomb(tile)
        tile.classList.remove("flag")
        tile.classList.add("bomb")

        if (!tile.classList.contains("rightclicked")) {
            tile.classList.add("clicked")
        }

        if (i === unsortedBombsIdx.length - 1) {
            clearInterval(timer)
        }

        i++
    }, 1000 / board[2])

    setTimeout(function () {

        let timer2 = setInterval(function () {

            let tile = document.getElementById(`idx${unsortedBombsIdx[j]}`)

            tile.classList.remove("bomb")
            if (j === unsortedBombsIdx.length - 1) {
                clearInterval(timer2)
                resetBtnEl.disabled = false
                for (el of selectLevelBtnEls) {
                    el.disabled = false
                }
            }

            j++

        }, 1000 / board[2])
    }, 200)
}

// create a bomb-element and append it to the parent element.
function appendBomb(parent) {

    let newBomb = document.createElement("i")

    newBomb.classList.add("fa-sm")
    newBomb.classList.add("fa-solid")
    newBomb.classList.add("fa-bomb")
    newBomb.classList.add("fa-shake")

    parent.appendChild(newBomb)
}

// update the flag counter based on the flag on the board.
function updateCounter() {
    flagCounterEl.innerText = document.querySelectorAll(".flag").length
}

// if the empty elements of victory-grid correspond to the bombs-index-array the game is won, call render win function.
function checkWin() {

    vIdx.length = 0

    let vPos = victoryGrid.indexOf("v")

    while (vPos !== -1) {
        vIdx.push(vPos)
        vPos = victoryGrid.indexOf("v", vPos + 1)
    }

    let win = true

    for (i = 0; i < vIdx.length; i++) {
        if (vIdx[i] !== bombsIdx[i]) {
            win = false
        }
    }

    if (win) {
        renderWin()
        clearInterval(clock)
    }
}

// change background color to win color, disable event listener.
function renderWin() {

    boardEl.classList.add("win")
    boardEl.removeEventListener("click", clickTile)
    boardEl.removeEventListener("contextmenu", rightClickTile)
}


/*----- start!! -----*/

init()
