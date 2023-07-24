/*----- app's state (variables) -----*/

const begBoard = [9, 9, 10]       //row,col,bombs
const intBoard = [16, 16, 40]
const expBoard = [30, 16, 99]
let bombsIdx
let board
let grid

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
boardEl.addEventListener("contextmenu", rightClickTile)

resetBtn.addEventListener("click", init)

/*----- functions -----*/

function init() {
    boardEl.addEventListener("click", clickTile)

    bombCounter.innerText = ""
    bombsIdx = []


    createBoard()
    grid = createGrid()

    bombCounter.innerText = board[2]

    generateBombs()
    placeBombs()
    populateGrid()

    //renderBoard()
}

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
    if (e.target.disabled) {
        return
    }

    switch (e.target.innerText) {
        case "":
            e.target.innerText = "F"
            e.target.classList.add("flag")
            break;
        case "F":
            e.target.innerText = "?"
            e.target.classList.remove("flag")
            e.target.classList.add("clicked")
            break;
        case "?":
            e.target.innerText = ""
            e.target.classList.remove("clicked")
            break;
    }
}

function clickTile(e) {   //placeholder
    if (!e.target.classList.contains("gameTile")) {
        return
    }
    e.target.disabled = true
    e.target.classList.add("clicked")
    e.target.classList.remove("flag")

    let idx = parseInt(e.target.getAttribute("id").slice(3))

    if (grid[idx] === "B") {

        e.target.classList.add("bomb")

        for (el of bombsIdx) {
            document.getElementById(`idx${el}`).innerText = grid[el]
            document.getElementById(`idx${el}`).classList.add("clicked")
            document.getElementById(`idx${el}`).classList.remove("flag")
            boardEl.removeEventListener("click", clickTile)
        }

    } else if (grid[idx] !== 0) {

        e.target.innerText = grid[idx]
        colorNum(e.target)

    } else {

        let checkIfReveal = checkGrid([idx])

        for (i = 0; i < checkIfReveal.length; i++) {

            if (grid[checkIfReveal[i]] !== 0) {

                document.getElementById(`idx${checkIfReveal[i]}`).innerText = grid[checkIfReveal[i]]
                document.getElementById(`idx${checkIfReveal[i]}`).classList.add("clicked")
                document.getElementById(`idx${checkIfReveal[i]}`).classList.remove("flag")
                document.getElementById(`idx${checkIfReveal[i]}`).disabled = true
                colorNum(document.getElementById(`idx${checkIfReveal[i]}`))

            } else {

                document.getElementById(`idx${checkIfReveal[i]}`).classList.add("clicked")
                document.getElementById(`idx${checkIfReveal[i]}`).classList.remove("flag")
                document.getElementById(`idx${checkIfReveal[i]}`).innerText = ""
                document.getElementById(`idx${checkIfReveal[i]}`).disabled = true

                for (el of checkGrid([checkIfReveal[i]], true)) {
                    if (!checkIfReveal.includes(el)) {
                        checkIfReveal.push(el)
                    }
                }

            }
        }
    }
}

function generateBombs() {
    while (bombsIdx.length < board[2]) {
        let bomb = Math.floor(Math.random() * board[0] * board[1])
        if (!bombsIdx.includes(bomb)) {
            bombsIdx.push(bomb)
        }
    }
}

function placeBombs() {
    for (el of bombsIdx) {
        grid[el] = "B"
    }
}

function createGrid() {

    let arr = []

    for (let i = 0; i < (board[0] * board[1]); i++) {
        arr.push(0)
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

// function renderBoard() { //placeholder

//     for (i = 0; i < grid.length; i++) {
//         if (grid[i]) {
//             document.getElementById(`idx${i}`).innerText = grid[i]
//         }
//         if (grid[i] === "B") {
//             document.getElementById(`idx${i}`).style.backgroundColor = "black";
//             document.getElementById(`idx${i}`).style.color = "white";
//         }
//     } 
// }

function checkGrid(arrOfIdx, boolean) {

    let arr = []

    for (el of arrOfIdx) {

        //row+1 col+0
        if (el + board[0] < board[0] * board[1]) { arr.push(el + board[0]) }
        //row-1 col+0
        if (el - board[0] >= 0) { arr.push(el - board[0]) }

        //row+0 col+1
        if (el + 1 <= board[0] * board[1] && ((el + 1) % (board[0])) !== 0) { arr.push(el + 1) }
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

function colorNum(el){
    el.classList.add(`num${el.innerText}`)
}


// start!!

init()
