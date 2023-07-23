/*----- app's state (variables) -----*/

const begBoard = [9,9,10]
const intBoard = [16,16,40]
const expBoard = [30,16,100]

/*----- cached element references -----*/

boardEl = document.querySelector(".board")

selectLevelBtnEls = document.querySelectorAll(".selectLevel")

resetBtn = document.querySelector("#reset")

/*----- event listeners -----*/

for (btn of selectLevelBtnEls){
    btn.addEventListener("click", defineBoard)
}

boardEl.addEventListener("click", clickTile)

resetBtn.addEventListener("click", init)

/*----- functions -----*/

init()

function init() {
    renderBoard()
}

function defineBoard(e) {
    if (e.target.classList.contains("beg")){
        boardEl.classList.add("beginner")
        boardEl.classList.remove("intermediate")
        boardEl.classList.remove("expert")
    } else if (e.target.classList.contains("int")) {
        boardEl.classList.remove("beginner")
        boardEl.classList.add("intermediate")
        boardEl.classList.remove("expert")
    } else if (e.target.classList.contains("exp"))  {
        boardEl.classList.remove("beginner")
        boardEl.classList.remove("intermediate")
        boardEl.classList.add("expert")
    }
    renderBoard()
}

function renderBoard() {

    let board
    deleteBoard()

    if (boardEl.classList.contains("beginner")) {
        board = begBoard
    } else if (boardEl.classList.contains("intermediate")) {
        board = intBoard
    } else if (boardEl.classList.contains("expert")) {
        board = expBoard
    }

    for (let i = 0; i < board[0]*board[1]; i++){
        let newBtn = document.createElement("button")
        newBtn.classList.add("gameTile")
        newBtn.classList.add(`idx${i}`)
        boardEl.appendChild(newBtn)
    }
}

function deleteBoard() {
    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.lastChild);
      }    
}

function clickTile(e){
    if (!e.target.classList.contains("gameTile")){
        return
    }
    e.target.classList.add("clicked")
}












