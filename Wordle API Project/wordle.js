const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6; 

// Set Loading Bar to hide when setLoading(false) is called in init, or when any
// API process finishes the "fetch" sequence.
const setLoading = (isLoading) => {
    console.log(isLoading);
    loadingDiv.classList.toggle('hidden', !isLoading);
};

// Regex to check for a-z and A-Z (lower/upperCase).
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array) {
    const Obj = {};
    for (let i = 0; i < array.length; i++) {
        if (Obj[array[i]]) {
            Obj[array[i]]++;
        }
        else {
            Obj[array[i]] = 1;
        }
    }
    return Obj;
}


async function init() {
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;

    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    console.log(word);
    let done = false;
    setLoading(false);
    isLoading = false;


    
    function addLetter(letter) {   
        // Append letter to the last element if length < 5.
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        }
        // Replace letter of the last element if length = 5.
        else {
            currentGuess = currentGuess.substring(0,currentGuess.length - 1);
            currentGuess += letter;
        }
        // Edit innerText to display the changes/input, tracks last letter by ...
        // using "currentGuess.length - 1" and iteratively updates the DOM.
        letters[ANSWER_LENGTH*currentRow+currentGuess.length-1].innerText = letter;
    }
    
    async function commit() {
         
        isLoading = true;
        setLoading(true);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
           method: "POST",
           body: JSON.stringify({ word: currentGuess })  
        });

        const resObj = await res.json();
        const validWord = resObj.validWord;
        isLoading = false;
        setLoading(false);

        if (!validWord) {
            markInvalidWord(); 
            return;
        }

        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);

        if (currentGuess.length != ANSWER_LENGTH) {
            return
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                map[guessParts[i]]--;        
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                // Do nothing! Your greatest talent :)
            }
            else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                map[guessParts[i]]--;        
            }
            else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }  

        currentRow++;
        if (word === currentGuess) {
            alert("Nice job!");
            document.querySelector('.brand').classList.add('winner')
            done = true;
            return;
        }
        else if (currentRow === ROUNDS) {
            alert(`You lose! The word was ${word}`);
            done = true;
        }
        currentGuess = '';

    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length-1);
        letters[ANSWER_LENGTH*currentRow+currentGuess.length].innerText = '';
    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
    
            setTimeout(function () {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
            }, 10);
        }
    }

    // Callback function that checks for keystrokes! One of three options:
    // 'Enter' to validate word, 'Backspace' to delete a letter or 
    // 'Letter' for valid input! Each conditional handles the
    document.addEventListener('keydown', function handleKeyPress (event) {

        if (done || isLoading) {
            return;
        }
        const action = event.key; 

        if (action === 'Enter') {
            commit();
        } 
        else if (action === 'Backspace') {
            backspace();
        }
        else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        }
        else {
            // Do nothing! We do not want any other case to change our interface. 
        }
    });
}

init();

