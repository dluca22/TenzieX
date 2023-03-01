import React, { useState, useEffect } from 'react';
import Dice from './Dice';
import './style.css';
// import Confetti from "react-confetti"

export default function App() {
  // creato un object che definisce un nuovo dado  cui passiamo solo id e poi il resto viene creato qua
  //funzione con return ritorna un object
  let newDice = function (id) {
    let _id = id;
    return {
      id: _id,
      value: Math.floor(Math.random() * 6 + 1),
      locked: false,
    };
  };

  // retrieves "score" from localStorage, if not present, default number is really high so can be set lower after firs try
  const [score, setScore] = useState(
    localStorage.getItem('score')
      ? JSON.parse(localStorage.getItem('score'))
      : 999
  );

  // --state setting --
  // setting counter for number of rolls, later will set to localStorage
  const [counter, setCounter] = useState(0);
  //state is set by anon function that calls for a newHand
  const [dices, setDices] = useState(() => newHand());
  //  default to false, but becomes true from checker function, with new hand, returns false
  const [gameCompleted, setGameCompleted] = useState(false);

  // defines the board from the array of dice that is saved to state
  const board = dices.map((die) => (
    <Dice
      key={die.id}
      value={die.value}
      locked={die.locked}
      handleClick={() => lockDie(die.id)}
    />
  ));

  // returns a new array after creating 10 newDice objects with the forloop
  // resets counter
  function newHand() {
    setCounter(0);
    let hand = [];
    for (let i = 1; i <= 10; i++) {
      hand.push(newDice(i));
    }
    return hand;
  }

  // rolls new dices for unlocked spots, and updates counter
  function rollDice() {
    setCounter((counter) => counter + 1);
    setDices((currentHand) =>
      currentHand.map((oldDice) => {
        return oldDice.locked ? oldDice : newDice(oldDice.id);
      })
    );
  }

  // gets the id from the function call and sets state to locked
  function lockDie(clickedId) {
    setDices((prevDices) => {
      return prevDices.map((die) => {
        return die.id === clickedId ? { ...die, locked: !die.locked } : die;
      });
    });
  }


  // helper function to check if is same value and is all locked
  function isSame() {
    const allHeld = dices.every((die) => die.locked);
    const firstValue = dices[0].value;
    const allSameValue = dices.every((die) => die.value === firstValue);
    return allHeld && allSameValue ? true : false;
  }

  // polished this useEffect with inspiration from the lesson, seems a bit cleaner
  useEffect(() => {
    setGameCompleted(dices.every(isSame) ? true : false);
  }, [dices]);

  // DEVE salvare in storage quando viene modificato score tramite useEffect
  useEffect(() => {
      if (gameCompleted) {
        if (counter != 0 && score > counter) {
          setScore(counter);
        }
        localStorage.setItem('score', score);
      }
    },
    [gameCompleted]
  );

  // display button based on game completed or not
  let button;
  if (gameCompleted == true) {
    // for game completed display "Play Again",
    //    onclick calls setState to a newHand directly inline without helper function
    button = (
      <button
        className='roll-button'
        onClick={() => setDices(() => newHand())}
      >
        Play Again
      </button>
    );
  } else {
    button = (
      <button className='roll-button' onClick={rollDice}>
        Roll
      </button>
    );
  }

  // added confetti as a new prop, is a self sustained component, just rendered on game completed==true
  // {gameCompleted && <Confetti />}
  return (
    <main>
      <h1 className='title'>Tenzies</h1>
      <p className='rules'>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <div className='dices'>{board}</div>
      {button}

      <div className='tries'>
        Tries:
        <span style={{ color: gameCompleted ? 'green' : 'red' }}>
          {counter}
        </span>
      </div>
      <div>
        score:
        {score === 999 ? " Unset" : score}
      </div>
    </main>
  );
}
