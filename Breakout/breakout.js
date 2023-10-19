
// Selecting HTML elements using querySelector. We will
// be modifying both the grid-display and the score to play the game.

// We're defining the "Breakout" block size to be 100x20.
// We will be designing the graphics, and interactions
// using these parameters. The ball will have a diameter of 20
// and the floorboard will have a size of 560x300. 
// xDirection and yDirection define the speed which our ball moves at.

const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = -4
let yDirection = 4

// userStart is the pre-defined starting platform position for the user (x,y)
// It is centered on the page.
// We will be updating currentPosition in response to UI/Keyboard Strokes.

const userStart = [230, 10]
let currentPosition = userStart

/// ballStart is the pre-defined ball starting position for the user (x,y)
// It is centered on the page.
// We will be updating currentPosition in response to UI input.

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let timerId
let score = 0

// Here we construct a class called "Block" that will take on four attributes.
// We pass a constructor that outlines the 'parameters' associated with each object instance. 
// Each attribute will represent the respective pixel corner for each of our blocks.
// The reason we're doing this is to define a 2-D Surface Area range for each   

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

// Here we initialize an array of "Block" objects. To understand these 
// constructor values that are passed in, let's look at our desired 
// layout for breakout blocks: 

// B-1 B-2 B-3 B-4 B-5
// B-6 B-7 B-8 B-9 B-A
// B-B B-C B-D B-E B-F

// ^^^ BLOCK ORIENTATION IN HEX ^^^

// Think about it, each Block is 100px x 20px 
// Lets' give 10px spacing between each block. 
// Block 1 may start at (10,270) but its width its 100px!
// If B-1 has 100px width,  and 10px gap, 10 (B-1 Start) + 
// 100 (B-1 Width) + 10 (Block Gap) = 120! The same start as B-2!
// B-1 - B-5 are on the same row, so their y-axis(270) will reflect that.

const blocks = [
  new Block(10, 270), // Block 1 
  new Block(120, 270), // Block 2             B-1 B-2 B-3 B-4 B-5 
  new Block(230, 270), // Block 3             B-6 B-7 B-8 B-9 B-A
  new Block(340, 270), // Block 4             B-B B-C B-D B-E B-F
  new Block(450, 270), // Block 5 
  new Block(10, 240), // Block 6              ^ BLOCK ORIENTATION ^
  new Block(120, 240), // Block 7 
  new Block(230, 240), // Block 8 
  new Block(340, 240), // Block 9 
  new Block(450, 240), // Block A 
  new Block(10, 210), // Block B
  new Block(120, 210), // Block C 
  new Block(230, 210), // Block D 
  new Block(340, 210), // Block E
  new Block(450, 210), // Block F
]

/*
  In addBlocks(), presumably after our HTML loads,
  we render each of the blocks in the "blocks" array of 
  "Block() object instances. With a singular for loop,
  for each "new Block()" in const blocks() we A. Create a 
  new div "element" using the createElement method.
  B. Add the 'block' attribute found in style.css to color
  it blue and give its width/height. Then, we add a "left" 
  and "right" style for positioning, which we acess from 
  this particular blocks[i]'s "bottomLeft" class attribute
  where Bottomleft = [xAxis, yAxis] as seen in line 45. 
  Then, now that block has width, height, and left/right
  position, we append it to grid! When we do this to all
  elements in blocks[] array, we'll have all 15 elements shown.
*/

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'  
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
    grid.appendChild(block)
  }
}
addBlocks()

// Similarly, we create a 'user' div element and add the 
// user class/style to append to our grid using the 
// createElement, classList and appendChild methods. 

const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()


//After appending "user" to grid, we need to render
// the current position according to the keystrokes.
// We'll take care of that logic soon, but for now
// we update the "left" and "bottom" tags to justify
// the current position of our paddle.

function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

// Next, we create a 'ball' div element and add the 
// ball class/style to append to our grid using the 
// createElement, classList and appendChild methods. 

const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()


//After appending "user" to grid, we need to render
// the current position that is constantly being updated.
// We'll take care of that logic soon, but for now
// we update the "left" and "bottom" tags to justify
// the current position of our ball given the width/height.

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// I think this is an interesting piece of the program.
// moveBall:
// we set timerId to have a 30ms interval by which "moveBall"
// is called. Notice, this is an automatic function that will 
// continue to execute until the clearInterval method is called.
// moveUser:
// moveUser however, is dependent on an eventlistener, it's not a
// constant execution on a particular interval, rather the moveUser
// callback Fn is only called when any "keydown" stoke has been detected.

timerId = setInterval(moveBall, 30)
document.addEventListener('keydown', moveUser)

// We defined xDirection and yDirection to be a set value 
// that corresponds to our velocity. Here every 30ms, 
// we move ballCurrentPosition xDirection and yDirection
// amounts. We can theoretically increase the speed by
// decreasing the value in the 2nd argument in setInterval. Try it!
// We then call "checkforCollisions".

function moveBall() {
  ballCurrentPosition[0] += xDirection
  ballCurrentPosition[1] += yDirection
  drawBall()
  checkForCollisions()
}

/*
  moveUser initailizes the 'keydown' event to 
  be variable 'e'. We set up a switch statement
  on e, (if statement would work too!) to check if the
  'keydown' was 'ArrowLeft', or 'ArrowRight'. If neither, break 
  out of the statement. So in the case that it is arrowleft, 
  we move our currentPosition's x-coordinate by -10 and if 
  'ArrowRight' we move our currentPosition's x-coordinate by +10. 
  Remember currentPosition[] represents an array with 2 elements
  representing [xCoord, yCoord]. Notice, however, there is an if 
  statmeent in each making sure that we're not overstepping our bounds.
  In the case of ArrowLeft, we want to make sure we're at least at position 0.
  In the case of ArrowRight we want to make sure our x-position + blockWidth 
  (our right side of paddle) < boardWidth!
*/
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10
        drawUser()   
      }
      break
    case 'ArrowRight':
      if (currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10
        drawUser()   
      }
      break
  }
}

/*
  Farely complex function, let's look at it line-by-line.
*/

function checkForCollisions() {
  // When we call checkForCollisions. We iterate through ALL block objects in "blocks" array (Line 69-85)
  for (let i = 0; i < blocks.length; i++){
    // This GIANT if statement checks if our ball hit any of our "block" objects listed in Line 69-85.
    if(
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&  // For any Block, if Ball's x-coordinate is greater than the
      ballCurrentPosition[0] < blocks[i].bottomRight[0]) && // LEFT boundary and less than the RIGHT Boundary. AND 
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] &&  // the top of the ball (y-coord + ballDiameter) is 
      ballCurrentPosition[1] < blocks[i].topLeft[1])){ // greater than any block's bottom-y but less than its top-y, then the ball must be 
      const allBlocks = Array.from(document.querySelectorAll('.block')) // "within" this particular block[i]. and we must register a "collision" 
      allBlocks[i].classList.remove('block') // If this is true, then select allBlocks as a NodeList, but converted to array using 'Array.from()'.
      blocks.splice(i,1) // After removing class 'block' from allBlocks[i]. we also remove it from blocks[] as to not create 'ghost' interactions.
      changeDirection() // We have collided, and thus we must change the ball direction by calling changeDirection().
      score++ // We broke a block, let's incremenent the score using the increment operator.
      scoreDisplay.innerHTML = score // And let's display it by editing scoreDisplay (dcoument.querySelector object) using innerHTML method.
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      } // Winning condition! We removed all blocks, so the length is 0. Display "You win" using the innerHTML method on our HTML object. We then clear timerID to
      // stop moveement altogether, and removeEventListener for any 'keydown' to stop movement of the user paddle.
    }
  }
  // This large if statement has two parts - A. Checking for WALL HITS, B. Checking for PADDLE HITS
  if ((ballCurrentPosition[0] >= (boardWidth - ballDiameter) || // If ball's x-axis + diameter (right-side) >= boardWidth
      ballCurrentPosition[0] <= 0 || // OR If ball's x-axis < 0.
      ballCurrentPosition[1] >= (boardHeight - ballDiameter)) // // OR if ball's y-axis + it's diamater (top of ball) > boardHeight
      || // If any of these are true, then, we collided with left, top, or right boundary of our game, and we should call changeDirection().
      // If none of the above are true, let's check the case where our ball hits our paddle.
      // B. Checking for PADDLE HITS.
      ((ballCurrentPosition[0] > currentPosition[0] && // If ball's center x-axis position is greater than paddle's left-most x-axis position
      ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&  // If ball's center x-axis position is less than paddle's right-most x-axis position.
      (ballCurrentPosition[1] > currentPosition[1] &&  // If ball's center y-position is greater than the paddle's bottom y-axis position.
      ballCurrentPosition[1] < currentPosition[1] + blockHeight))){ // If balls' center y-position is less than paddle's top y-axis position. 
    changeDirection()
  }
  // C. Checking for LOSS-CONDITION. Ball colides with the bottom of our grid! 
  // clearInterval(timerID) to stop ball movmement, removeEventListener to stop user movement. Read "you lose" with innerHTML mod. 
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'You lose!'
    document.removeEventListener('keydown', moveUser)
  }
}


// This is not the most realistic implementation of "bouncing"
// As a [4,4] direction colliding with an x-axis platform and y-axis
// platform do not behave the same way. But for the sake of simplicity.
// We invert each positive value to a negative and negative to positive with
// a bias for the xdirection.

function changeDirection() {
  if (xDirection === 4 && yDirection === 4) {
    yDirection = -4
    return
  }
  if (xDirection === 4 && yDirection === -4) {
    xDirection = -4
    return
  }
  if (xDirection === -4 && yDirection === -4) {
    yDirection = 4
    return
  }
  if (xDirection === -4 && yDirection === 4) {
    xDirection = 4
    return
  }
}