/*----- app's state (variables) -----*/

const begBoard = [9, 9, 10]       //col,row,bombs
const intBoard = [16, 16, 40]
const expBoard = [30, 16, 99]
const bombsIdx = []
let board = []

/*----- cached element references -----*/

boardEl = document.querySelector(".board")

selectLevelBtnEls = document.querySelectorAll(".levelBtn")

resetBtn = document.getElementById("reset")

bombCounter = document.getElementById("bombCounter")

/*----- event listeners -----*/

for (btn of selectLevelBtnEls) {
    btn.addEventListener("click", defineBoard)
}

boardEl.addEventListener("click", clickTile)

resetBtn.addEventListener("click", init)

/*----- functions -----*/

function defineBoard(e) {
    if (e.target.classList.contains("beg")) {
        boardEl.classList.add("beginner")
        boardEl.classList.remove("intermediate")
        boardEl.classList.remove("expert")
    } else if (e.target.classList.contains("int")) {
        boardEl.classList.remove("beginner")
        boardEl.classList.add("intermediate")
        boardEl.classList.remove("expert")
    } else if (e.target.classList.contains("exp")) {
        boardEl.classList.remove("beginner")
        boardEl.classList.remove("intermediate")
        boardEl.classList.add("expert")
    }
    createBoard()
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
        let newBtn = document.createElement("button")
        newBtn.classList.add("gameTile")
        newBtn.classList.add(`idx${i}`)
        boardEl.appendChild(newBtn)
    }

    bombCounter.innerText = board[2]
    generateBombs()
    placeBombs()

}

function deleteBoard() {
    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.lastChild);
    }
}

function clickTile(e) {
    if (!e.target.classList.contains("gameTile")) {
        return
    }
    e.target.classList.add("clicked")  //placeholder
}

function generateBombs() {

    bombsIdx.length = 0

    while (bombsIdx.length < board[2]) {
        let bomb = Math.floor(Math.random() * board[0] * board[1])
        if (!bombsIdx.includes(bomb)) {
            bombsIdx.push(bomb)
        }
    }
}

function placeBombs() {
    for (let i = 0; i < bombsIdx.length - 1; i++) {
        document.querySelector(`.idx${ bombsIdx[i]}`).innerText = "B"
  }
}

function init() {
    bombCounter.innerText = ""
    bombsIdx.length = 0

    createBoard()
    console.log(bombsIdx)
    console.log(bombsIdx.length)
}

init()
