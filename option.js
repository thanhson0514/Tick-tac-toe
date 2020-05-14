const options = document.querySelector('.options')
const computerBtn = document.querySelector('.computer')
const friendBtn = document.querySelector('.friend')
const oBtn = document.querySelector('.o')
const xBtn = document.querySelector('.x')
const playBtn = document.querySelector('.play')
const gameOver = document.querySelector('.gameover')

const player = new Object
let OPPONENT;

computerBtn.addEventListener('click', e => {
  OPPONENT = "computer"
  switchActive(computerBtn, friendBtn)
})

friendBtn.addEventListener('click', e => {
  OPPONENT = "friend"
  switchActive(friendBtn, computerBtn)
})

xBtn.addEventListener('click', e => {
  player.man = 'X'
  player.computer = 'O'
  player.friend = 'O'
  switchActive(xBtn, oBtn)
})

oBtn.addEventListener('click', e => {
  player.man = 'O'
  player.computer = 'X'
  player.friend = 'X'
  switchActive(oBtn, xBtn)
})

playBtn.addEventListener('click', e => {
  if(!OPPONENT) checkChoose('Make sure choose player varsus!')
  else if(!player.man) checkChoose('Make sure choose symbol!')
  else {
    checkChoose('')
    console.log(player, OPPONENT)
    options.classList.add('hide')
    document.querySelector('#canvas').classList.remove('hide')
    init(player, OPPONENT)
  }
})

function switchActive(on, off) {
  on.classList.add('active')
  off.classList.remove('active')
}

function checkChoose(msg) {
  document.querySelector('.error').innerHTML = msg
  setTimeout(() => {
    document.querySelector('.error').innerHTML = ''
  },3000)
}
