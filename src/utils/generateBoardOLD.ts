import { Mode } from '../types';
import { arrayToGrid } from './arrayToGrid';
import { getModeDetails } from './getModeDetails';

const generateRandomInput = (numberOfTiles: number, numberOfMines: number) => {
    let mineIndices = [];
    while (mineIndices.length < numberOfMines) {
        const random = Math.floor(Math.random() * numberOfTiles);
        if (mineIndices.indexOf(random) === -1) mineIndices.push(random);
    }

    let result = [];
    for (let i = 0; i < numberOfTiles; i++) {
        result.push(mineIndices.includes(i) ? "X" : "-");
    }
    return result;
}

const generateBoardFromInput = (input: string[], rowCount: number, rowLength: number) => {
    const countAdjacentMinesInRow = (row: string[], rowPos: number): number => {
        const subrow = [];
        if (rowPos === 0) {
            subrow.push(...row.slice(0, 2));
        }
        else if (rowPos === rowLength - 1) {
            subrow.push(...row.slice(-2));
        }
        else {
            subrow.push(...row.slice(rowPos - 1, rowPos + 2));
        }

        return subrow.filter((e) => e === "X").length;
    }

    const countAdjacentMines = (grid: string[][], rowIndex: number, rowPos: number): number => {
        const countPrevRow = rowIndex - 1 >= 0
            ? countAdjacentMinesInRow(grid[rowIndex - 1], rowPos)
            : 0;
        const countCurrRow = countAdjacentMinesInRow(grid[rowIndex], rowPos);
        const countNextRow = rowIndex + 1 < rowCount
            ? countAdjacentMinesInRow(grid[rowIndex + 1], rowPos)
            : 0;
        return countPrevRow + countCurrRow + countNextRow;
    }

    if (input.length !== rowLength * rowCount) {
        throw new Error("Input grid must contain correct number of elements");
    }
    const grid = arrayToGrid(input, rowLength);
    const output = input.map((tile, i) => {
        if (tile === "X") {
            return tile;
        }
        const rowIndex = Math.floor(i / rowLength);
        const rowPos = i % rowLength;
        return `${countAdjacentMines(grid, rowIndex, rowPos)}`;
    })
    return output;
}

export const generateBoard = (mode: Mode = Mode.Easy): string[] => {
    const { rowCount, rowLength, mineCount } = getModeDetails(mode);
    const input = generateRandomInput(rowCount * rowLength, mineCount);
    return generateBoardFromInput(input, rowCount, rowLength);
}