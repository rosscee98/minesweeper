import React, { useEffect, useState } from 'react';
import './App.css';
import { arrayToGrid } from './utils/arrayToGrid';

const rows = ["A", "B", "C", "D", "E"];
const ROW_LENGTH = 5;

const input = [
  "2", "X", "2", "0", "0",
  "3", "X", "3", "0", "0",
  "3", "X", "3", "0", "0",
  "3", "X", "3", "0", "0",
  "2", "X", "2", "0", "0",
];
const grid = arrayToGrid(input, ROW_LENGTH);
const cellIds = [
  "A1", "A2", "A3", "A4", "A5",
  "B1", "B2", "B3", "B4", "B5",
  "C1", "C2", "C3", "C4", "C5",
  "D1", "D2", "D3", "D4", "D5",
  "E1", "E2", "E3", "E4", "E5",
]

const getCells = () => {
  return cellIds.map((cellId, i) => ({
    id: cellId,
    value: input[i],
    clicked: false,
  }))
}

const App = () => {
  const [cells, setCells] = useState(getCells());
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  useEffect(() => {
    const won = !cells
      .filter((cell) => cell.clicked === false)
      .some((cell) => cell.value !== 'X');
    const lost = cells
      .filter((cell) => cell.clicked === true)
      .some((cell) => cell.value === 'X')
    setHasWon(won);
    setHasLost(lost);
  }, [cells]);

  const setCellToClicked = (cellId: string) => {
    const newCells = cells.map((cell) => {
      return (cell.id === cellId ? { ...cell, clicked: true } : cell);
    })
    setCells(newCells);
  }

  const handleClick = (cellId: string, value: string) => {
    if (hasWon || hasLost) return;
    setCellToClicked(cellId);
  }

  const resetGame = () => {
    setCells(getCells());
    setHasLost(false);
  }

  return (
    <>
      <button onClick={resetGame} data-testid="reset">Reset</button>
      <div className="game" data-testid="game">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rows[rowIndex]}`}>
            {row.map((value, cellIndex) => {
              const cellId = `${rows[rowIndex]}${cellIndex + 1}`;
              const isClicked = cells.find((cell) => cell.id === cellId)!.clicked;
              return (
                <button
                  key={`cell-${cellId}`}
                  className={`${isClicked ? 'clicked' : ''}`}
                  onClick={() => handleClick(cellId, value)}
                > {
                    (hasWon || hasLost) ?
                      (value === "X" || isClicked) && value
                      :
                      isClicked && value
                  }</button>
              )
            })}
          </div>
        ))}
      </div>
      {hasLost && "You lost!"}
      {hasWon && "You won!"}
    </>
  );
}

export default App;
