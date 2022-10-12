import { Dispatch, SetStateAction } from 'react';
import { Cell } from '../../types';
import { getCellIds } from '../../utils/getCellIds';

type Props = {
    cells: Cell[],
    setCells: Dispatch<SetStateAction<Cell[]>>,
    rowLength: number,
    hasWon: boolean,
    hasLost: boolean,
    isFlagging: boolean,
    rowIndex: number,
    cellIndex: number,
    value: string,
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

const GameCell = ({ cells, setCells, rowLength, hasWon, hasLost, isFlagging, rowIndex, cellIndex, value }: Props) => {
    const cellId = (rowIndex * rowLength) + cellIndex;
    const cellIds = getCellIds(cells);
    const { isClicked, isFlagged } = cells.find((cell) => cell.id === cellId)!;

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

    const handleClick = (cellId: number, cellValue: string) => {
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

    const handleRightClick = (cellId: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const { isClicked, isFlagged } = cells.find((cell) => cell.id === cellId)!;
        if (!isClicked) {
            updateCell(cellId, "isFlagged", !isFlagged);
        }
    }

    const updateCell = (cellId: number, property: "isFlagged" | "isClicked", value: boolean = true) => {
        const newCells = cells.map((cell) => {
            return (cell.id === cellId ? { ...cell, [property]: value } : cell)
        })
        setCells(newCells);
    }

    const recursivelyCheckCells = (cellId: number, checkedCells: Set<number> = new Set([cellId])): Set<number> => {
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

    const getNeighbourCells = (cellId: number): Cell[] => {
        const cellIndex = cellIds.findIndex((cell) => cell === cellId);
        const rowIndex = Math.floor(cellIndex / rowLength);
        const rowPos = cellIndex % rowLength;

        let neighbours: number[] = [];
        [-1, 0, 1].forEach((offset) => neighbours.push(...getNeighbourCellsInRow(rowIndex + offset, rowPos)));

        return neighbours
            .filter((neighbourCellId) => neighbourCellId !== cellId)
            .map((neighbourCellId) => cells.find((cell) => cell.id === neighbourCellId)!);
    }

    const getNeighbourCellsInRow = (rowIndex: number, rowPos: number) => {
        const row = cellIds.slice(rowIndex * rowLength, ((rowIndex + 1) * rowLength));
        return row
            .slice(((rowPos - 1) > 0 ? (rowPos - 1) : 0), rowPos + 2)
            .filter((cellId) => cellId !== undefined);
    }

    const setCellsToClicked = (cellIds: number[]) => {
        const newCells = cells.map((cell) => {
            return (
                cellIds.includes(cell.id)
                    ? { ...cell, isClicked: true }
                    : cell
            )
        })
        setCells(newCells);
    }

    return (
        <button
            key={`cell-${cellId}`}
            data-testid={`cell-${cellId}`}
            className={`cell ${isClicked ? `clicked ${cellColour[value]}` : ''}`}
            onClick={() => handleClick(cellId, value)}
            onContextMenu={(e) => handleRightClick(cellId, e)}
        > {
                getTextContent(value, isClicked, isFlagged)
            }</button>
    )
}

export default GameCell;