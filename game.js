function init(player, OPPONENT) {
  const cvs = document.querySelector('#canvas')
  const ctx = cvs.getContext('2d')

  // defined image
  const xImage = new Image()
  const oImage = new Image()

  xImage.src = 'img/X.png'
  oImage.src = 'img/O.png'

  // defined constant variable
  const COLUMN = 3
  const ROW = 3
  const SPACE_SIZE = 150
  const COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  let GAME_OVER = false
  let board = []
  let gameData = new Array(9)
  let currentPlayer = player.man

  // draw board
  function drawBoard() {
    let id = 0
    for(let i = 0; i < ROW; ++i) {
      board[i] = []
      for(let j = 0; j < COLUMN; ++j) {
        board[i][j] = id
        ++id

        // draw space for board
        ctx.strokeStyle = '#000'
        ctx.strokeRect(j*SPACE_SIZE, i*SPACE_SIZE, SPACE_SIZE, SPACE_SIZE)
      }
    }
  }
  drawBoard()

  cvs.addEventListener('click', e => {
    // exit game if game over
    if(GAME_OVER) return

    let X = e.clientX - cvs.getBoundingClientRect().x;
    let Y = e.clientY - cvs.getBoundingClientRect().y;

    let i = Math.floor(Y/SPACE_SIZE)
    let j = Math.floor(X/SPACE_SIZE)

    let id = board[i][j]

    // if gameData has id then return
    if(gameData[id]) return
    gameData[id] = currentPlayer

    // draw image current player
    drawOnBoard(currentPlayer, i, j)

    // check is winner
    if(isWinner(gameData, currentPlayer)) {
      showGameOver(currentPlayer)
      GAME_OVER = true
      return
    }

    //check is tie
    if(isTie(gameData)) {
      showGameOver("Tie")
      GAME_OVER = true
      return
    }

    if(OPPONENT == "computer") {
      let id = minimax(gameData, player.computer).id

      // if gameData has id then return
      gameData[id] = player.computer

      // get i and j of space
      let space = getIJ(id)

      // draw image current player
      drawOnBoard(player.computer, space.i, space.j)

      // check is winner
      if(isWinner(gameData, player.computer)) {
        showGameOver(player.computer)
        GAME_OVER = true
        return
      }

      //check is tie
      if(isTie(gameData)) {
        showGameOver("Tie")
        GAME_OVER = true
        return
      }
    } else {
      // switch player
      currentPlayer = currentPlayer == player.man ? player.friend : player.man
    }
  })

  // MINIMAX
  function minimax(gameData, PLAYER) {
    if( isWinner(gameData, player.computer) ) return { evaluation: +10 }
    if( isWinner(gameData, player.man) ) return { evaluation: -10 }
    if( isTie(gameData) ) return { evaluation: 0 }

    let EMPTY_SPACES = getEmptySpaces(gameData)
    let moves = []
    console.log('empty space', EMPTY_SPACES)

    for(let i = 0; i < EMPTY_SPACES.length; ++i) {
      let id = EMPTY_SPACES[i]
      let backup = gameData[id]

      // make move for the player
      gameData[id] = PLAYER
      let move = {}
      move.id = id

      if( PLAYER == player.computer){
        move.evaluation = minimax(gameData, player.man).evaluation;
      }else{
        move.evaluation = minimax(gameData, player.computer).evaluation;
      }


      // restore space
      gameData[id] = backup

      // save move
      moves.push(move)
    }

    let bestMove

    if(PLAYER == player.computer) {
      let bestEvaluation = -Infinity

      for(let i = 0; i < moves.length; i++){
        if( moves[i].evaluation > bestEvaluation ){
          bestEvaluation = moves[i].evaluation
          bestMove = moves[i]
        }
      }
    } else {
      // MINIMIZER
      let bestEvaluation = +Infinity

      for(let i = 0; i < moves.length; i++){
        if( moves[i].evaluation < bestEvaluation ){
          bestEvaluation = moves[i].evaluation
          bestMove = moves[i]
        }
      }
    }
    // console.log(bestMove, moves[0].evaluation)
    return bestMove
  }

  // GET EMPTY SPACES
  function getEmptySpaces(gameData){
    let EMPTY = []

    for( let id = 0; id < gameData.length; id++){
      if(!gameData[id]) EMPTY.push(id)
    }

    return EMPTY
  }

  // GET i AND j of a SPACE
  function getIJ(id){
    for(let i = 0; i < board.length; i++){
      for(let j = 0; j < board[i].length; j++){
        if(board[i][j] == id) return { i : i, j : j}
      }
    }
  }


  // check for a win
  function isWinner(gameData, player) {
    for(let i = 0; i < COMBOS.length; ++i) {
      let wow = true

      for(let j = 0; j < COMBOS[i].length; ++j) {
        let id = COMBOS[i][j]
        wow = gameData[id] == player && wow
      }

      if(wow) return true
    }

    return false
  }

  // check for a tie
  function isTie(gameData) {
    let isBoardFill = true

    for(let i = 0; i < gameData.length; ++i) {
      isBoardFill = gameData[i] && isBoardFill
    }

    if(isBoardFill) return true
    return false
  }

  function showGameOver(player) {
    let message = player == "Tie" ? "OOPs No Winner":"The Winner is"
    let imgSrc = player == "Tie" ? "img/tie.png" : `img/${player}.png`

    gameOver.innerHTML = `
    <div class="container-play-again">
      <h1>${message}</h1>
      <img src="${imgSrc}" alt="image" />
      <div class="play-again" onclick="window.location.reload()">PLAY AGAIN</div>
    </div>
    `

    cvs.classList.add('hide')

    gameOver.classList.remove('hide')
  }

  function drawOnBoard(player, i, j) {
    let img = player == "X" ? xImage : oImage

    ctx.drawImage(img, j*SPACE_SIZE, i*SPACE_SIZE)
  }
}
