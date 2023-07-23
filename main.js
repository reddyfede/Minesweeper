/*----- app's state (variables) -----*/

const begBoard = [9, 9, 10]       //row,col,bombs
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
        newBtn = document.createElement("button")
        newBtn.classList.add("gameTile")
        newBtn.setAttribute("id", `idx${i}`)
        newBtn.innerText = ""
        boardEl.appendChild(newBtn)
    }

    bombCounter.innerText = board[2]
    generateBombs()
    placeBombs()
    fullBoard()

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

function placeBombs() {   //placeholder

    for (el of bombsIdx){
        document.getElementById(`idx${el}`).innerText = "B"
    }
}

function init() {
    bombCounter.innerText = ""
    bombsIdx.length = 0
    createBoard()
}

init()


function fullBoard() {
    let arr = []

    for (el of bombsIdx) {

        //next row +0
        if (el + board[0] <= board[0] * board[1]) { arr.push(el + board[0]) }
        //prew row +0
        if (el - board[0] >= 0) { arr.push(el - board[0]) }

        //same row +1
        if (el + 1 <= board[0] * board[1] && ((el + 1) % (board[0])) !== 0) { arr.push(el + 1) }
        //next row +1
        if (el + 1 + board[0] <= board[0] * board[1] && ((el + 1) % board[0]) !== 0) { arr.push(el + board[0] + 1) }
        //prew row +1
        if (el + 1 - board[0] > 0 && ((el + 1) % board[0]) !== 0) { arr.push(el - board[0] + 1) }

        // add same row -1
        if (el - 1 >= 0 && ((el % board[0]) !== 0)) { arr.push(el - 1) }
        //next row -1
        if (el - 1 + board[0] <= board[0] * board[1] && (el % board[0]) !== 0) { arr.push(el + board[0] - 1) }
        //prew row -1
        if (el - 1 - board[0] >= 0 && (el % board[0]) !== 0) { arr.push(el - board[0] - 1) }
    }

    let asd

    for (el of arr) {
        asd = document.getElementById(`idx${el}`)
        if ((asd.textContent === "") && asd.textContent !== "B") {
            console.log(asd.textContent)
            asd.textContent = "1"
            
        } else if (asd.textContent !== "B") {
            asd.textContent = parseInt(asd.textContent) + 1
        }
    }


    for (let i=0; i<board[0]*board[1]; i++){
        console.log(document.getElementById(`idx${i}`).textContent)
    }
    console.log("fine")


}

