
/* 
    The JS code for Rock Paper Scissors is divided into three parts.
    1. Displaying and storing userInput
    2. Generating and displaying randomnized computerInput
    3. Generating and Displaying a "Win/Loss" result given both inputs. 

*/

/*
    
    We use const variables for initializing to DOM elements for type safety! 
    We use var for dynamic variables that will be used throughout the program!
    We use let for dynamic variables that should be block-scoped!

    computerChoiceDisplay, userChoiceDisplay and resultDisplay are initialized using 
    the JS Method, document.getElementById. The getElementById() method of the Document 
    interface returns an Element object representing the element whose id property 
    matches the specified string. 

    allButtons is initialized by using the JS Method - document.querySelectorAll().
    The Document method querySelectorAll() returns a static NodeList representing 
    a list of the document's elements that match the specified group of selectors.

*/

const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('results');
const allButtons = document.querySelectorAll('button');
var userChoice;
var computerChoice;
var result = 0;

/*
    Part 1. Displaying and storing userInput.

    After initializing "allButtons" to a NodeList comprised of the three buttons - 
    {"rock", "paper", "scissors"}  we'll use the forEach method to iterate over each "Node" 
    (in this case, button). forEach takes in a callbackFn which in this case will be "addEventListener". 
    Here, for each 'button' in allButtons, the callbackFn will add an EventListener that will execute 
    an event in response to 'click'. Said another way, we add a function that awaits a "click" to each button. 

    Within the function body, we initialize "userChoice" to refer to the element that triggered the "mouse click" event.
    This is "event.target", where event was the callbackFn argument and target referring to the particular element.
    The "id" property retrieves the identifier, now making "userChoice" equals to one of the three identifiers 
    (ex:"rock" if the user clicks on the button with id="rock"). 

    Then, we set the userChoiceDisplay to the identifier ID using the innerHTML method, and now the HTML document should 
    read the name of the button that was clicked. We then call generateComputerChoice() and being the second part of this
    basic project.
*/


allButtons.forEach(button => button.addEventListener('click', (event) => {
    userChoice = event.target.id;
    userChoiceDisplay.innerHTML = userChoice;
    generateComputerChoice();
    getResult();
}))

/*
    Part 2. Generating and displaying randomnized computerInput
    
    There isn't much DOM manipulation here, so it's pretty easy to explain.
    First, we created a function called "getRandomInt" that uses the Math.random() method
    to return a floating-point (decimal) beween [0,1). To generate values between 1-3,
    we multiply by the input size of 3. (Ex: 0.99 * 3 = 2.97). We then call Math.floor() method
    to get that value down to a range of 0-2. Once our getRandomInt function returns a random value from
    0-2, we map each value using a conditional if,else if and else statement to get 'Rock', 'Paper' or
    "Scissors" respectively. computerChoice is then initialized to the corresponding id-name
    and once again, innerHTML will edit the HTML and indicate the "random" choice made by the computer. 

*/

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function generateComputerChoice() {
    const randomNumber =  getRandomInt(3);

    if (randomNumber === 0) {
        computerChoice = 'Rock';
    }
    else if (randomNumber === 1) {
        computerChoice = 'Paper';
    }
    else {
        computerChoice = 'Scissors';
    }
    computerChoiceDisplay.innerHTML = computerChoice;
}

/*
    Part 3. Generating and Displaying a "Win/Loss" result given both inputs. 

    Once generateComputerChoice sets the innerHTML value to the corresponding random choice,
    generateComputerChoice() will complete, drop from the function stack, and proceed from 
    line 55 to line 56 where getResult() is called. 
    Here, in getResult() we resolve the appropriate combinations to update the score where 
    Rock v Scissors or Paper v Rock or Scissors v Paper increment the "result" variable, 
    matching combinations result in a tie (nothing happens) and all other choices where
    computer wins, decrements the result operator. We finish our program by setting the result
    using the innerHTML element. Have fun!

*/


function getResult () {
    
    if ((userChoice === "Rock" && computerChoice === "Scissors") ||
        (userChoice === "Paper" && computerChoice === "Rock") ||
        (userChoice === "Scissors" && computerChoice === "Paper")) {
        
            result++;
    }
    else if (userChoice === computerChoice) {
        //Do nothing
    }
    else {
        result--;
    }

    resultDisplay.innerHTML = result;
}
