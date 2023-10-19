/* There are some interesting parts to this program. 

    Part 1 - Moving our mole by calling moveMole().  
    Part 2 - Interacting with our mole! 
    Part 3 - CountDown!

*/

/*

    We use const's for global, static element init's and let for dynamic
    elements that will be modified. As covered in previous games, querySelectorAll
    initializes our square and mole consts to be a NodeList. 

*/
const square = document.querySelectorAll('.square');
const mole = document.querySelectorAll('.mole');
// document.querySelector('#time-left) assigns the const timeLeft variable to be a DOM element.
const timeLeft = document.querySelector('#time-left');
let score = document.querySelector('#total-score');

let result = 0;
let currentTime = timeLeft.textContent;
let timerId = setInterval(countDown, 1000);


// Part 1 - Mole movement.

// To start the random movement by our mole we use the setInterval method.
// According to MDN - setInterval(callback, delay, arg1, arg2, ...)
// the callback function is executed repeatedly every "delay" ms. 
// Therefore, we call the 'randomSquare' function every 500 ms. 
// Once we call moveMole() once, our setInterval function will begin to execute.
// However, we also have a "setTimeout" function that clears our timerID
// after 60seconds, thereby completing the function after the 60s timer is up. 

function moveMole() {
    let timerId = setInterval(randomSquare, 500);

    setTimeout(function() {
        clearInterval(timerId);
      }, 60000); // Stop after 60 seconds
}

moveMole();

// When we call randomSquare(), we immediately remove any 'mole' attribute to clear
// our board using the forEach function. This is an O(n) operation as we must iterate
// through each element just to remove one element. It is not very efficient. Fix later.

// Let's dissect this square.forEach function to clear up somethings for myself.
// forEach accoridng to MDN document takes in a callbackFn - forEach(callbackFn). 
// We pass in an arrow function that takes the "className" parameter, (representing
// the current element of square), and grab the classList property to remove "mole".

// What else can we do with classList? .add(className), .remove(className)
// .toggle(className) [if (exists) remove, else add], .contains(className) [bool]
// and replace(oldClass, newClass). Javascript is pretty cool. 

function randomSquare() {
    square.forEach(className => {
        className.classList.remove('mole');
    })
// Here, we generate a randomPosition from values (0,8). As Math.random generates [0,1) 
// we get a random value from [0,8) (pay attention, floor(0.99 * 9) = 8)
// as randomPosition = square[(randval)], a random index in the square[] array,
// randomPosition.classList.add('mole') will add the 'mole' class in CSS to our select
// div.  
    let randomPosition = square[Math.floor(Math.random() * 9)];
    randomPosition.classList.add('mole');

    hitPosition = randomPosition.id;
}

// Here, we add the ability to interact with each of our elements by 
// using another forEach method to iterate through square[] and
// use 'id' as a parameter to add an event listener on each 'square' index. 
// Here the event we're waiting for is not a click-down but a release click.
// This allows us to only call once per click rather than calling several hundred
// times as we hold down click. 

square.forEach(id => {
    id.addEventListener('mouseup', () => {
        if(id.id === hitPosition) {
            result += 1;
            score.textContent = result;
            randomSquare()
        }
    })
})

// Finally, we'll use setInterval again to call "countDown" every 1000ms (1s).
// Notice on line 23 and line 24, there are two variables to pay attention to.
// Line 23 - let currentTime = timeLeft.textContent;
// Line 24 - let timer Id = setInterval(countDown, 1000);
// Timer_ID sets an interval that repeats every 1000ms. Here,countDown is called
// every second. In countDown, we decrement the currentTime, and edit the  html
// text of 'timeLeft' to reflect this change. When currentTime === 0, then we clearInterval
// on timerId to stop the setInterval function, and alert the end of the game.  

function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime === 0) {
        clearInterval(timerId);
        alert('GAME OVER! Your final score is ' + result);

    }
}

