import React, { useState } from 'react';
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

type Cell = {
  id: string,
  value: string,
  isClicked: boolean,
  isFlagged: boolean,
};

const getCells = (): Cell[] => {
  return cellIds.map((cellId, i) => ({
    id: cellId,
    value: input[i],
    isClicked: false,
    isFlagged: false,
  }))
}

const cellColour: Record<string, string> = {
  '1': 'blue',
  '2': 'green',
  '3': 'red',
  '4': 'purple',
  '5': 'darkred',
  '6': 'darkturqoise',
  'default': ''
}

const App = () => {
  const [cells, setCells] = useState(getCells());
  const [isFlagging, setIsFlagging] = useState(false);

  const hasWon = cells
    .filter((cell) => cell.isClicked === false)
    .every((cell) => cell.value === 'X');
  const hasLost = cells
    .filter((cell) => cell.isClicked === true)
    .some((cell) => cell.value === 'X')

  const updateCell = (cellId: string, property: "isFlagged" | "isClicked", value: boolean = true) => {
    const newCells = cells.map((cell) => {
      return (cell.id === cellId ? { ...cell, [property]: value } : cell)
    })
    setCells(newCells);
  }

  const setCellsToClicked = (cellIds: string[]) => {
    const newCells = cells.map((cell) => {
      return (
        cellIds.includes(cell.id)
          ? { ...cell, isClicked: true }
          : cell
      )
    })
    setCells(newCells);
  }

  const getNeighbourCellsInRow = (rowIndex: number, rowPos: number) => {
    const row = cellIds.slice(rowIndex * ROW_LENGTH, ((rowIndex + 1) * ROW_LENGTH));
    return row
      .slice(rowPos - 1, rowPos + 2)
      .filter((cellId) => cellId !== undefined);
  }

  const getNeighbourCells = (cellId: string): Cell[] => {
    const cellIndex = cellIds.findIndex((cell) => cell === cellId);
    const rowIndex = Math.floor(cellIndex / ROW_LENGTH);
    const rowPos = cellIndex % ROW_LENGTH;

    let neighbours: string[] = [];
    [-1, 0, 1].forEach((offset) => neighbours.push(...getNeighbourCellsInRow(rowIndex + offset, rowPos)));

    return neighbours
      .filter((neighbourCellId) => neighbourCellId !== cellId)
      .map((neighbourCellId) => cells.find((cell) => cell.id === neighbourCellId)!);
  }

  const recursivelyCheckCells = (cellId: string, checkedCells: Set<string> = new Set([cellId])): Set<string> => {
    let uncheckedNeighbourCells = getNeighbourCells(cellId)
      .filter((cell) => !checkedCells.has(cell.id));

    let newCheckedCells = new Set([...Array.from(checkedCells), ...uncheckedNeighbourCells.map((cell) => cell.id)]);

    uncheckedNeighbourCells.forEach((cell) => {
      if (cell.value === "0") {
        const neighboursOfNeighbours = recursivelyCheckCells(cell.id, new Set(newCheckedCells));
        neighboursOfNeighbours.forEach((id) => newCheckedCells.add(id));
      }
    })

    return newCheckedCells;
  }

  const handleClick = (cellId: string, cellValue: string) => {
    if (hasWon || hasLost) return;

    const { isClicked, isFlagged } = cells.find((cell) => cell.id === cellId)!;

    if (isFlagging && !isClicked) {
      updateCell(cellId, "isFlagged", !isFlagged);
    }
    else if (!isFlagged) {
      updateCell(cellId, "isClicked")
    };

    if (cellValue === "0") {
      const cellsToReveal = recursivelyCheckCells(cellId);
      setCellsToClicked(Array.from(cellsToReveal));
    };
  }

  const resetGame = () => {
    setCells(getCells());
    setIsFlagging(false);
  }

  const getTextContent = (value: string, isClicked: boolean, isFlagged: boolean): string => {
    const isMine = value === "X";
    const isBlank = value === "0";

    if (hasWon || hasLost) {
      return (isMine || (isClicked && !isBlank)) ? value : "";
    }

    if (isFlagged) {
      return "F";
    }
    else {
      return (isClicked && !isBlank) ? value : "";
    }
  }

  return (
    <>
      <button onClick={resetGame} data-testid="reset">Reset</button>
      <button onClick={() => setIsFlagging(!isFlagging)}>Flag</button>
      <div className="container">
        <div className="game" data-testid="game">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rows[rowIndex]}`}>
              {row.map((value, cellIndex) => {
                const cellId = `${rows[rowIndex]}${cellIndex + 1}`;
                const { isClicked, isFlagged } = cells.find((cell) => cell.id === cellId)!;

                return (
                  <button
                    key={`cell-${cellId}`}
                    data-testid={`cell-${cellId}`}
                    className={`cell ${isClicked ? `clicked ${cellColour[value]}` : ''}`}
                    onClick={() => handleClick(cellId, value)}
                  > {
                      getTextContent(value, isClicked, isFlagged)
                    }</button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <p>{hasLost && "You lost!"}</p>
      <p>{hasWon && "You won!"}</p>
      <p>{isFlagging ? "Flagging on" : "Flagging off"}</p>
    </>
  );
}

export default App;
