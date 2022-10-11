import { Dispatch, SetStateAction } from 'react';
import { Cell } from '../../types';
import GameCell from '../game-cell/game-cell';

type Props = {
    cells: Cell[],
    setCells: Dispatch<SetStateAction<Cell[]>>,
    isFlagging: boolean,
    hasWon: boolean,
    hasLost: boolean,
    grid: string[][],
    rowLength: number,
};

const Game = ({ cells, setCells, isFlagging, hasWon, hasLost, grid, rowLength }: Props) => {
    return (<div className="container">
        <div className="game" data-testid="game">
            {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`}>
                    {row.map((value, cellIndex) => {
                        return (<GameCell key={cellIndex} {...{ cells, setCells, rowLength, hasWon, hasLost, isFlagging, rowIndex, cellIndex, value }} />)
                    })}
                </div>
            ))}
        </div>
    </div>)
}

export default Game;