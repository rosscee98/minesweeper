import { Dispatch, SetStateAction } from 'react';
import { Cell } from '../../types';
import { arrayToGrid } from '../../utils/arrayToGrid';
import GameCell from '../game-cell/game-cell';

type Props = {
    cells: Cell[],
    setCells: Dispatch<SetStateAction<Cell[]>>,
    isFlagging: boolean,
    hasWon: boolean,
    hasLost: boolean,
    input: string[],
    rowLength: number,
};

const Game = ({ cells, setCells, isFlagging, hasWon, hasLost, input, rowLength }: Props) => {
    const grid = arrayToGrid(input, rowLength);

    return (<div className="container">
        <div className="game" data-testid="game">
            {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`}>
                    {row.map((value, cellIndex) => {
                        return (<GameCell {...{ cells, setCells, rowLength, hasWon, hasLost, isFlagging, rowIndex, cellIndex, value }} />)
                    })}
                </div>
            ))}
        </div>
    </div>)
}

export default Game;