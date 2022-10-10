import React, { useState } from 'react';
import './App.css';
import Game from './components/game/game';
import { Cell, Difficulty } from './types';

const input = [
  "2", "X", "2", "0", "0",
  "3", "X", "3", "0", "0",
  "3", "X", "3", "0", "0",
  "3", "X", "3", "0", "0",
  "2", "X", "2", "0", "0",
];
// const input = [
//   "2", "X", "2", "0", "0", "0", "0", "0",
//   "3", "X", "3", "0", "0", "0", "0", "0",
//   "3", "X", "3", "0", "0", "0", "0", "0",
//   "3", "X", "3", "0", "0", "0", "0", "0",
//   "2", "X", "2", "0", "0", "0", "0", "0",
//   "1", "1", "1", "0", "0", "0", "0", "0",
// ];

const getCells = (): Cell[] => {
  return input.map((_, i) => ({
    id: i,
    value: input[i],
    isClicked: false,
    isFlagged: false,
  }))
}

const App = () => {
  const [cells, setCells] = useState(getCells());
  const [isFlagging, setIsFlagging] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const hasWon = cells
    .filter((cell) => cell.isClicked === false)
    .every((cell) => cell.value === 'X');
  const hasLost = cells
    .filter((cell) => cell.isClicked === true)
    .some((cell) => cell.value === 'X')

  const resetGame = () => {
    setCells(getCells());
    setIsFlagging(false);
  }

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const rowLength = {
    'easy': 5,
    'medium': 16,
    'hard': 30
  }[difficulty];

  return (
    <>
      <Game {...{ cells, setCells, isFlagging, hasWon, hasLost, input, rowLength }} />
      <button onClick={resetGame} data-testid="reset">Reset</button>
      <button onClick={() => setIsFlagging(!isFlagging)}>Flag</button>
      <div className="difficulty-group">
        {
          difficulties.map((label) => {
            return (
              <button key={label} onClick={() => setDifficulty(label)}>{label}</button>
            )
          })
        }
      </div>
      <p>{hasLost && "You lost!"}</p>
      <p>{hasWon && "You won!"}</p>
      <p>{isFlagging ? "Flagging on" : "Flagging off"}</p>
      <p>Mode: {difficulty}</p>
    </>
  );
}

export default App;
