const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0

// First, we create 225 'div' elements and append
// each to our grid. The reason for this, is although
// our grid is 300px x 300px, each 'grid'-size as seen
// in our CSS file, is 20px x 20px. 300/20 = 15! 
// If 15 box fit in height and 15 box fit in width
// 15x15 =225! 225 "Boxes" that will layout each 'space'  
// in our game. 

for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

// Now, we grab every element containing css elements '.grid div' 
// that was just generated with our for pevious loop (line 19), 
// using querySelectorAll and convert the NodeList to an Array using Array.from
// method. 

const squares = Array.from(document.querySelectorAll('.grid div'))

// To start our game, we define the desired "starting" positions for our
// invaders, namely blocks 0-9 ([0-9][0]) 15-24 ([0-9][1]) 30-39 ([0-9][2])
// A total of 30 blocks exist, each taking the first 10 starting positions of
// the first three rows.

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

// We loop through 'alienInvaders' array, and if any particular
// "alien" does not exist in the 'aliensRemoved' array, then we add the 'invader'
// tag to its corresponding block (Ex: On our 10th loop, index 10 in alienInvaders array has a value 15,
// so we 'invader' to squares[15] or the 15th square!  

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}

// Then we call the function.
draw()


// Adding a single shooter that is 20px x 20px is as simple
// as predifing "currentShooterIndex" to be the block value of 
// 202 in 'squares' (this corresponds to Row 13, column 7 (15*13 + 7)).
// by adding 'shooter' class, we now have our user. However, we still
// need to add functionality such as shooting and moving.

squares[currentShooterIndex].classList.add('shooter')

// Here, we add the functionality for user movement. 
// As seen in previous games, addEventListener applies
// an async await method where arg0 signifies what the event
// is, and arg1 signifying the callbackFn, (or the response to
// this event occurring). 
document.addEventListener('keydown', moveShooter)

// Here we call the callbackFn in response to any key movement. We remove the 'shooter' class
// for repositioning, and use a switch statement on our event (e) for ArrowLeft or ArrowRight
// movement.  

//If the 'keydown' event was an ArrowLeft key, we first check if the currentShooter's
// position + width (offset from center) modulus to the board width is not equal to 0 (meaning
// we're not at the left-boundary) then we decrement currentShooterIndex by one. 

//Similarly, in the case of moving the shooter to the right ('ArrowRight'),
// the code checks if the current shooter index modulo the width of the grid 
// is less than width - 1. If it is less than width - 1, it means
// we're not at the right-boundary and we can safely increment by one. 
function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1
      break
  }
  // Here, after currentShooterIndex has been updated, we add the 'shooter'
  // class back to its updates squares[] grid.

  squares[currentShooterIndex].classList.add('shooter')
}

// Every 600ms we'll call 'moveInvaders' for the entire time this program is
// executing UNTIL 'clearInterval' is called on invadersID such as when we 
// win or lose. The moveInvaders() function will handle movement.  
invadersId = setInterval(moveInvaders, 600)

// Anytime this function is called, which it will be called in moveInvaders(),
// we iterate through the entire array of alienInvaders, and delete every 'invader' 
// class to 'clear' the board of invaders. This is only called before we add the
// invaders again.

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

/*
We define two variables leftEdge and rightEdge to determine if invaders reached 
the leftmost and rightmost edges of the grid. We use (%) to check if the
first alien invader's index (alienInvaders[0]) is at the left edge (divisible by the grid width)
and if the last alien invader's index (alienInvaders[alienInvaders.length - 1]) is at the right edge 
*/
function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
  remove()

  // Are we at the RIGHTEDGE AND GOINGRIGHT? 
  // If yes, we need to change directions. 
  // We must also add one width  to every alienInvaders element. 
  // Then we call draw() (Line 158, the other if condition won't be true.)
  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  // Are we at the LEFTEDGE AND GOINGLEFT? 
  // If yes, we need to change directions. 
  // We must also subtract one width to every alienInvaders element. 
  // Then we call draw(). 

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  // So after these two if statements, we've either hit a boundary and dropped
  // one space and changed directions. Now, we must add the "direction" value
  // before we call draw() to show the new position. We iterate through alienInvaders,
  // and either add +1 or -1 depending on where the direction is at. 

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  // If enough 'direction' and width push-downs could occur where a single grid has both
  // 'invader' and 'shooter' caused by not shooting the invaders fast enough, you lose!

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER'
    clearInterval(invadersId)
  }

  // If the condition alienInvaders[i] > squares.length is true,
  // it means the current alien invader has moved below the grid, 
  // indicating a game over condition.

  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = 'GAME OVER'
      clearInterval(invadersId)
    }
  }
  
  // If all of aliensRemoved becomes as large as alienInvaders
  // then there are no Invaders remaining, a winning condition. 
  // We must clearInterval for all cases as to stop the movement of
  // the 'imaginary' invaders. 

  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN'
    clearInterval(invadersId)
  }
}
// Once again, our favorite method for JS Gaming 
// addEventListener appends an async function awaiting for a
// 'keydown' event to call shoot(). Here, this provides the ability
// to supply logic whenever we use a key, which in this case is 'arrowup'.

document.addEventListener('keydown', shoot)


function shoot(e) {
 
  let laserId
  let currentLaserIndex = currentShooterIndex
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser') // (remove 'laser')
    currentLaserIndex -= width                          // update its position to be -width (-15)
    squares[currentLaserIndex].classList.add('laser') // add 'laser'

    // Now we must check for collisions. If squares[lasterPosition] also has 'invader', then we do the following:
    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser') // Remove 'laser' tag
      squares[currentLaserIndex].classList.remove('invader')// Remove 'invader' tag
      squares[currentLaserIndex].classList.add('boom') // Add 'boom' tag to make it white/red (ur choice)

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300) // Then set a timeout to remove 'boom' after 300ms.
      clearInterval(laserId) // Then we clear the interval for  'laserId' to stop laser movement. 

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex) // Here, we index the particlar alienInvader that was just removed
      aliensRemoved.push(alienRemoved) // Then we push it to the 'aliensRemoved' array. Remember, our winning condition checks
      // for equality bettween aliensRemoved array and our original alienInvader array (all aliens). So if all aliens = aliens removed. NO ALIENS! WIN!
      results++ // We killed an invader, let's incremeent one to the results integer.
      resultsDisplay.innerHTML = results // Then let's dispaly that.
    }
  }
  switch(e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100)
  }
}
