/*----- app's state (variables) -----*/

const begBoard = [9, 9, 10]       //row,col,bombs
const intBoard = [16, 16, 40]
const expBoard = [30, 16, 99]
let bombsIdx
let vIdx
let board
let grid
let victoryGrid

/*----- cached element references -----*/

boardEl = document.querySelector(".board")

selectLevelBtnEls = document.querySelectorAll(".levelBtn")

resetBtnEl = document.getElementById("reset")

counterEl = document.getElementById("counter")

/*----- event listeners -----*/

for (btn of selectLevelBtnEls) {
    btn.addEventListener("click", defineBoard)
}

boardEl.addEventListener("click", clickTile)
boardEl.addEventListener("contextmenu", rightClickTile)

resetBtnEl.addEventListener("click", init)

/*----- functions -----*/

function init() {
    boardEl.addEventListener("click", clickTile)
    boardEl.addEventListener("contextmenu", rightClickTile)
    boardEl.classList.remove("bomb")
    boardEl.classList.remove("win")

    counterEl.innerText = ""
    bombsIdx = []
    vIdx = []

    createBoard()
    grid = createGrid(0)
    victoryGrid = createGrid("v")

    counterEl.innerText = board[2]

    generateBombs()
    placeBombs()
    populateGrid()

}

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

function deleteBoard() {
    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.lastChild);
    }
}

function rightClickTile(e) {
    e.preventDefault()
    if (!e.target.classList.contains("gameTile")) {
        return
    }
    if (e.target.disabled) {
        return
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

function clickTile(e) {

    if (!e.target.classList.contains("gameTile")) {
        return
    }
    if (e.target.disabled) {
        return
    }

    e.target.disabled = true
    e.target.classList.add("clicked")
    e.target.classList.remove("flag")

    let idx = parseInt(e.target.getAttribute("id").slice(3))

    if (grid[idx] === "B") {

        boardEl.classList.add("bomb")
        boardEl.removeEventListener("click", clickTile)
        boardEl.removeEventListener("contextmenu", rightClickTile)

        for (el of bombsIdx) {
            let tile = document.getElementById(`idx${el}`)
            tile.innerText = ""
            appendBomb(tile)
            tile.classList.remove("flag")
            tile.classList.add("bomb")

            if (!tile.classList.contains("rightclicked")) {
                tile.classList.add("clicked")
            }

            window.setTimeout(function (el) {
                for (el of bombsIdx) {
                    tile.classList.remove("bomb")
                }
                e.target.classList.add("bomb")
            }, 100)
        }

    } else if (grid[idx] !== 0) {

        e.target.innerText = grid[idx]
        colorNum(e.target)
        victoryGrid[idx] = grid[idx]
        checkWin()

    } else {

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
        checkWin()
    }
    updateCounter()
}

function generateBombs() {

    while (bombsIdx.length < board[2]) {

        let bomb = Math.floor(Math.random() * board[0] * board[1])

        if (!bombsIdx.includes(bomb)) {
            bombsIdx.push(bomb)
        }
    }

    bombsIdx.sort(function (a, b) {
        if (a > b) {
            return 1
        }
        return -1
    })
}

function placeBombs() {

    for (el of bombsIdx) {
        grid[el] = "B"
    }
}

function createGrid(value) {

    let arr = []

    for (let i = 0; i < (board[0] * board[1]); i++) {
        arr.push(value)
    }

    return arr
}

function populateGrid() {

    let arr = checkGrid(bombsIdx, true)

    for (el of arr) {
        if (grid[el] !== "B") {
            grid[el] = grid[el] + 1
        }
    }
}

function checkGrid(arrOfIdx, boolean) {

    let arr = []

    for (el of arrOfIdx) {

        //row+1 col+0
        if (el + board[0] < board[0] * board[1]) { arr.push(el + board[0]) }
        //row-1 col+0
        if (el - board[0] >= 0) { arr.push(el - board[0]) }

        //row+0 col+1
        if (el + 1 < board[0] * board[1] && ((el + 1) % (board[0])) !== 0) { arr.push(el + 1) }
        //row+0 col-1
        if (el - 1 >= 0 && ((el % board[0]) !== 0)) { arr.push(el - 1) }


        if (boolean) {
            //row+1 col+1
            if (el + 1 + board[0] < board[0] * board[1] && ((el + 1) % board[0]) !== 0) { arr.push(el + board[0] + 1) }
            //row-1 col+1
            if (el + 1 - board[0] > 0 && ((el + 1) % board[0]) !== 0) { arr.push(el - board[0] + 1) }


            //row+1 col-1
            if (el - 1 + board[0] < board[0] * board[1] && (el % board[0]) !== 0) { arr.push(el + board[0] - 1) }
            //row-1 col-1
            if (el - 1 - board[0] >= 0 && (el % board[0]) !== 0) { arr.push(el - board[0] - 1) }
        }
    }
    return arr
}

function colorNum(el) {
    el.classList.add(`num${el.innerText}`)
}

function checkWin() {

    vIdx.length = 0

    let vPos = victoryGrid.indexOf("v")

    while (vPos !== -1) {
        vIdx.push(vPos)
        vPos = victoryGrid.indexOf("v", vPos + 1)
    }

    let win1 = true

    for (i = 0; i < vIdx.length; i++) {
        if (vIdx[i] !== bombsIdx[i]) {
            win1 = false
        }
    }

    if (win1) {
        renderWin()
    }
}

function renderWin() {
    boardEl.classList.add("win")
    boardEl.removeEventListener("click", clickTile)
    boardEl.removeEventListener("contextmenu", rightClickTile)

    for (el of bombsIdx) {
        document.getElementById(`idx${el}`).classList.add("flag")
        document.getElementById(`idx${el}`).classList.add("rightclicked")
    }
}

function appendBomb(parent) {
    let newBomb = document.createElement("i")
    newBomb.classList.add("fa-sm")
    newBomb.classList.add("fa-solid")
    newBomb.classList.add("fa-bomb")
    newBomb.classList.add("fa-shake")
    parent.appendChild(newBomb)
}

function updateCounter() {
    let flags = document.querySelectorAll(".flag")
    counterEl.innerText = board[2] - flags.length
}

/*----- start!! -----*/

init()
