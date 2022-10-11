import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Game from './components/game/game';
import { Cell, Difficulty } from './types';
import { arrayToGrid } from './utils/arrayToGrid';
import { generateBoard } from './utils/generateBoard';
import { getModeDetails } from './utils/getModeDetails';

const getCells = (mode: Difficulty = "easy"): Cell[] => {
  // const board = [
  //   "2", "X", "2", "0", "0",
  //   "3", "X", "3", "0", "0",
  //   "3", "X", "3", "0", "0",
  //   "3", "X", "3", "0", "0",
  //   "2", "X", "2", "0", "0",
  // ];
  const board = generateBoard(mode);
  return board.map((value, i) => ({
    id: i,
    value,
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

  const resetGame = useCallback(() => {
    setCells(getCells(difficulty));
    setIsFlagging(false);
  }, [difficulty]);

  useEffect(() => {
    resetGame();
  }, [difficulty, resetGame]);

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const { rowLength } = getModeDetails(difficulty);

  const grid = arrayToGrid(cells.map((cell) => cell.value), rowLength);

  return (
    <>
      <Game {...{ cells, setCells, isFlagging, hasWon, hasLost, grid, rowLength }} />
      <button onClick={resetGame} data-testid="reset">Reset</button>
      <button onClick={() => setIsFlagging(!isFlagging)}>Flag</button>
      <div className="difficulty-group">
        {
          difficulties.map((label) => {
            return (
              <button key={label} onClick={() => {
                setDifficulty(label);
                resetGame();
              }}>{label}</button>
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
