// This neat trick "document.addEventListener('DOMContentLoaded)" uses
// the addeventListener DOM method to await for all of the DOM/HTML to load
// before executing the JS. This allows the page to load the important HTMLCSS
// for speed, and replaces putting the "<script> tag at the footer. 

document.addEventListener('DOMContentLoaded', () => {

// cardArray represents an array of objects, each representing a set of cards with 
// a 'name' property used for indexing/id later and an 'img' property holding the url
// to an image for display a visual difference between the cards.

    const cardArray = [
        {
            name: 'bach',
            img: 'images/bach.jpg'
        },
        {
            name: 'bach',
            img: 'images/bach.jpg'
        },
        {
            name: 'beet',
            img: 'images/beet.jpg'
        },
        {
            name: 'beet',
            img: 'images/beet.jpg'
        },
        {
            name: 'chop',
            img: 'images/chop.jpg'
        },
        {
            name: 'chop',
            img: 'images/chop.jpg'
        },
        {
            name: 'debu',
            img: 'images/debu.jpg'
        },
        {
            name: 'debu',
            img: 'images/debu.jpg'
        },
        {
            name: 'prok',
            img: 'images/prok.jpg'
        },
        {
            name: 'prok',
            img: 'images/prok.jpg'
        },
        {
            name: 'ravel',
            img: 'images/ravel.jpg'
        },
        {
            name: 'ravel',
            img: 'images/ravel.jpg'
        },
    ];

    // This .sort method actually "shuffles" the cardArray so that
    // each refresh of the browser results in a random order.
    // As Math.random() generates a number from [0,1) (now -0.5 to 0.5 after sub).
    //  Once we get a value, sort() actually uses comparator functions to determine 
    // the relative ordering of each  element. By having a random() value appended 
    // into sort(). The sort() function does its job by sorting a random set of values 
    // causing an unpredictable change of card positions.

    cardArray.sort(()=> 0.5 - Math.random());

    // Part 1 - Generating a blank 4x5.
    
    const grid = document.querySelector('.grid');
    let resultDisplay = document.querySelector('#result')
    let chosenCardID = [];
    let chosenCard = []; 
    let cardsWon = [];

    // Part 1 - Let's generate a clickable but blank 3x4 board!
    //
    // Inside the loop, a new HTML image element (<img>) is created using 
    // the document.createElement('img') method.The newly created <img> 
    // element is then configured by setting its attributes - image source
    // and data id. The src attribute is set to 'images/blank.jpg'. 
    // This specifies the image file path or URL for the card, 
    // which in this case is a blank image. The data-id attribute 
    // is set to the current index i of the loop, used for indexing later.
    // An event listener is added to the card element using the
    // addEventListener() method with "flipcard" as the callback for when
    // the 'click' event occurs. Finally, the card element is appended to the 
    // parent element with a class name of grid.

    function createBoard() {
        for(let i = 0; i < cardArray.length; i++) {
            let card = document.createElement('img');
            card.setAttribute('src', 'images/blank.jpg');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipcard);
            grid.appendChild(card);
        }
    }
    // Function is called to generate the blank board! 
    // After this is called we get a set of 12 pictures.

    createBoard();

    // Part 2 - Handling the logic for when the image is flipped.
    //
    // Once the 'click' event has been observed for any of our 12 'card' 
    // elements that are all appended to grid, flipcard() is called.
    // Here, the 'this' keyword access a set of methods to use on the
    // parent object appended to the addEventListener function  ->>> card.addEventListener.
    // Here, we get the 'data-id' attribute defined during our for loop and set it to var cardID;
    // We then use the ID to index the correct card in cardArray and get the "name" attribute to push
    // into our pre-defined array "chosenCard", with that, we push cardID into chosenCardID array.
    // Now, we index the clicked card in cardArray by using the cardID and set the 'src' attribute to
    // the image stored in cardArray[].   

    function flipcard() {
        let cardID = this.getAttribute('data-id');
        chosenCard.push(cardArray[cardID].name);
        chosenCardID.push(cardID);
        this.setAttribute('src', cardArray[cardID].img);
        // Here, we check if the user has clicked two elements. If they have, we set a timeout
        // of 500ms after calling CheckMatch(). 
        if (chosenCard.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }

    // Part 3 - Checking if elements in chosenCard[] match! 
    // 
    // Our checkMatch() function was called as a callback fn in 
    // line 129 -  setTimeout(checkMatch, 500). We first initialize
    // cards to be a node list storing all elements of type 'img'. 
    // We then initialize optionOneID and optionTwoID to be variables
    // rerepsenting the 'id' attribute of the cards chosen by the user.
    // We then check if the cards themselves are equal, but do not have the same ID.
    // If there is a match, we annoyingly alert the user (sorry), and set the image
    // attributes to a blank background. We then remove the eventListener by calling the
    // same arguments we did for addEventListener, making these cards 'complete' and no
    // longer clickable. We then push the chosenCard array into "cardsWon" thereby
    // incrementing our counter. If there is no match, the else condition is true, 
    // and we simply turn the cards. Remember we called this func
    // with a  500ms "setTimeout" delay in line 129 so that our cards dont flip too quickly.
    // We then reset chosenCard and chosenCardID. the last if statements checks for a winCondition.
    // if cardsWon.length == 6, then we have found all pairs, and we edit the textContent to announce
    // their victory.

    function checkMatch() {
        let cards = document.querySelectorAll('img')
        const optionOneID = chosenCardID[0];
        const optionTwoID = chosenCardID[1];
        if ((chosenCard[0] === chosenCard[1]) && (chosenCardID[0] != chosenCardID[1])) {
            alert('You found a match!');
            cards[optionOneID].setAttribute('src','images/white.jpg');
            cards[optionTwoID].setAttribute('src','images/white.jpg');
            cards[optionOneID].removeEventListener('click', flipcard);
            cards[optionTwoID].removeEventListener('click', flipcard);
            cardsWon.push(chosenCard)
        } 
        else {
            cards[optionOneID].setAttribute('src', 'images/blank.jpg');
            cards[optionTwoID].setAttribute('src', 'images/blank.jpg');
        }
        chosenCard = [];
        chosenCardID = [];
        resultDisplay.textContent = cardsWon.length;
        if (cardsWon.length === cardArray.length/2) {
            resultDisplay.textContent = "Out of all games you could play in 2023, you chose this one! Wow! Are you OK? Anyways, congrats, I guess.";
        }
    }
});