import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Game from './components/game/game';
import { Cell, Mode } from './types';
import { arrayToGrid } from './utils/arrayToGrid';
import { generateBoard } from './utils/generateBoard/generateBoard';
import { getModeDetails } from './utils/getModeDetails';

const getCells = (mode: Mode = Mode.Easy): Cell[] => {
  const board = generateBoard(mode);
  return board.map((value, i) => ({
    id: i,
    value,
    isClicked: false,
    isFlagged: false,
  }))
}

const App = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [isFlagging, setIsFlagging] = useState(false);
  const [mode, setMode] = useState(Mode.Easy);

  const hasWon = cells
    .filter((cell) => cell.isClicked === false)
    .every((cell) => cell.value === 'X');
  const hasLost = cells
    .filter((cell) => cell.isClicked === true)
    .some((cell) => cell.value === 'X')

  const resetGame = useCallback(() => {
    setCells(getCells(mode));
    setIsFlagging(false);
  }, [mode]);

  useEffect(() => {
    resetGame();
  }, [mode, resetGame]);

  const { rowLength } = getModeDetails(mode);

  const grid = arrayToGrid(cells.map((cell) => cell.value), rowLength);

  const minesRemaining = hasWon
    ? 0
    : getModeDetails(mode).mineCount - cells.filter((cell) => cell.isFlagged).length

  return (
    <>
      <Game {...{ cells, setCells, isFlagging, hasWon, hasLost, grid, rowLength }} />
      <button onClick={resetGame} data-testid="reset">Reset</button>
      <button onClick={() => setIsFlagging(!isFlagging)}>Flag</button>
      <div className="difficulty-group">
        {
          Object.keys(Mode).map((mode) => {
            return (
              <button key={mode} onClick={() => {
                setMode(mode.toLowerCase() as Mode);
              }}>{mode}</button>
            )
          })
        }
      </div>
      <p>{hasLost && "You lost!"}</p>
      <p>{hasWon && "You won!"}</p>
      <p>{isFlagging ? "Flagging on" : "Flagging off"}</p>
      <p>Mode: {mode}</p>
      <p>Mines remaining: {minesRemaining}</p>
    </>
  );
}

export default App;
