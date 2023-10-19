/*
  document.addEventListener('DOMContentLoaded') is a neat way
  to await for the entire DOM/HTML to finish parsing before executing
  any JS. This is essentially equivalent to putting the <script> tag
  at the end of the html doc. Once 'DomContentLoaded' becomes true,
  the callbackfn (our entire codebase) begins executing.
*/


/*
  squares represents a NodeList containing all elements with selector
  '.grid div' and similarly result represents a DOM element with the ID
  '#result'. displayCurrentPlayer represents a DOM element with the ID
  'current-player'.  
*/

document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const result = document.querySelector('#result')
    const displayCurrentPlayer = document.querySelector('#current-player')
    let currentPlayer = 1

    // Reminders: squares is a Nodelist containing all 49 "grid div"
    // elements. We iterate through every 'squares' DOM element in the nodeList.
    // onclick is similar to addEventListener but should only be used
    // when you're certain you'll only need the 'click' event listener and no others.
  
    for (let i = 0; i < squares.length; i++) {
      squares[i].onclick = () => {
        //If the div element below yours is 'taken' (i+7, for a grid with 7 columns is tile below)
        // AND the current element that is being clicked is NOT taken, then we pass.
        // When this is true we append two classes "'taken" and "player-one" if p1 or "player-two" if p2.
        // We then change the currentPlayer to be the other player and edit the innerHTML to reflect this change.
        // If neither are true, we annoyingly alert the player "can't go there" while also calling "checkBoard" for
        // a winning sequence.
        if (squares[i + 7].classList.contains('taken') &&!squares[i].classList.contains('taken')) {
          if (currentPlayer == 1) {
            squares[i].classList.add('taken')
            squares[i].classList.add('player-one')
            currentPlayer = 2
            displayCurrentPlayer.innerHTML = currentPlayer
          } else if (currentPlayer == 2){
            squares[i].classList.add('taken')
            squares[i].classList.add('player-two')
            currentPlayer = 1
            displayCurrentPlayer.innerHTML = currentPlayer        
          } 
        } else alert('cant go here')
        checkBoard()
      }
    }

    /*

      The laziest implementation of a "winning" position is shown here.
      The problem is rather interesting. Given a matrix of m elements in a row and 
      n elements in a column, with "X" representing Player One, and "O" representing Player Two.
      How do I detect a winning ConnectFour position in O(N*M) time? My thoughts are 
      to individually find any sequences of diagonal, horizontal or vertical 
      sequences of four elements making this an 3N operation or O(N). 
      Or, you can just lazily copy paste the hard-coded winning positions 
      as I did here :). 

      If I have time, I will implement a cleverer sxn later. 
      Meanwhile, this will do.

    */
  
      const winningArrays = [
        [0, 1, 2, 3],
        [41, 40, 39, 38],
        [7, 8, 9, 10],
        [34, 33, 32, 31],
        [14, 15, 16, 17],
        [27, 26, 25, 24],
        [21, 22, 23, 24],
        [20, 19, 18, 17],
        [28, 29, 30, 31],
        [13, 12, 11, 10],
        [35, 36, 37, 38],
        [6, 5, 4, 3],
        [0, 7, 14, 21],
        [41, 34, 27, 20],
        [1, 8, 15, 22],
        [40, 33, 26, 19],
        [2, 9, 16, 23],
        [39, 32, 25, 18],
        [3, 10, 17, 24],
        [38, 31, 24, 17],
        [4, 11, 18, 25],
        [37, 30, 23, 16],
        [5, 12, 19, 26],
        [36, 29, 22, 15],
        [6, 13, 20, 27],
        [35, 28, 21, 14],
        [0, 8, 16, 24],
        [41, 33, 25, 17],
        [7, 15, 23, 31],
        [34, 26, 18, 10],
        [14, 22, 30, 38],
        [27, 19, 11, 3],
        [35, 29, 23, 17],
        [6, 12, 18, 24],
        [28, 22, 16, 10],
        [13, 19, 25, 31],
        [21, 15, 9, 3],
        [20, 26, 32, 38],
        [36, 30, 24, 18],
        [5, 11, 17, 23],
        [37, 31, 25, 19],
        [4, 10, 16, 22],
        [2, 10, 18, 26],
        [39, 31, 23, 15],
        [1, 9, 17, 25],
        [40, 32, 24, 16],
        [9, 17, 25, 33],
        [8, 16, 24, 32],
        [11, 17, 23, 29],
        [12, 18, 24, 30],
        [1, 2, 3, 4],
        [5, 4, 3, 2],
        [8, 9, 10, 11],
        [12, 11, 10, 9],
        [15, 16, 17, 18],
        [19, 18, 17, 16],
        [22, 23, 24, 25],
        [26, 25, 24, 23],
        [29, 30, 31, 32],
        [33, 32, 31, 30],
        [36, 37, 38, 39],
        [40, 39, 38, 37],
        [7, 14, 21, 28],
        [8, 15, 22, 29],
        [9, 16, 23, 30],
        [10, 17, 24, 31],
        [11, 18, 25, 32],
        [12, 19, 26, 33],
        [13, 20, 27, 34],
      ]
    
      // Alright now that we have our silly arrays of arrays of
      // winning positions, let's check if we won.

      /*
        We start with a for loop to iterate through the entire 'winningArrays'
        array. We will be checking every single array in winningArrays. 
        
        Let's walk through what square1 represents as this is fairly complicated.
        First, we're defining square1 to be a particular tile in the array 'squares'.
        // Reminder: squares is a Nodelist containing all 49 "grid div".
        Therefore winningArrays[y][0] SHOULD represent a value from 0-48. 
        winningArrays[y] on its own represents the y'th index in our "winningArrays" 
        array. Meaning if y = 0, then winningArrays[y] = [0, 1, 2, 3], our first array
        in winningArrays. Appending another [0] at the end means we're looking into the 0th index
        of the 0-index array in WinningArrays. Therefore square1 => square[winningArrays] (# from 0-48) => 
        squares[winningArrays[y]] where y = 0 (a number in array [0, 1, 2, 3]) and
        squares[winningArrays[y][0]] = 0! Likewise,const square2 = squares[winningArrays[y][1]]
        is equal to the 1st index of [0,1,2,3] when y = 0, making square2 = 1!.

        Then, we check if square1, square2, square3, square4 were clicked by player-one in
        line 172. If all of these were, then playerOne wins. If square1,square2,square3,square4 were
        clicked by player-two already, then the y'th position represents the winning position for player-two
        and we announce that player-two has won. Otherwise, if NEITHER has happened, then the index y in winningPosition
        has not happened yet, and we increment to check all other winningPositions. 
      */

      function checkBoard() {
        for (let y = 0; y < winningArrays.length; y++) {
          const square1 = squares[winningArrays[y][0]]
          const square2 = squares[winningArrays[y][1]]
          const square3 = squares[winningArrays[y][2]]
          const square4 = squares[winningArrays[y][3]]
    
          //check those squares to see if they all have the class of player-one
          if (
            square1.classList.contains('player-one') &&
            square2.classList.contains('player-one') &&
            square3.classList.contains('player-one') &&
            square4.classList.contains('player-one')
          )
          {
          result.innerHTML = 'Player One Wins!'
            window.setTimeout(() => {
              alert('Player One Wins!');
            },500);
          }
          //check those squares to see if they all have the class of player-two
          if (
            square1.classList.contains('player-two') &&
            square2.classList.contains('player-two') &&
            square3.classList.contains('player-two') &&
            square4.classList.contains('player-two')
          )
          {
              result.innerHTML = 'Player Two Wins!'
              window.setTimeout(() => {
              alert('Player Two Wins!');
              },500);
          }
        }
      }

  
     
});
    