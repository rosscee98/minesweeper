import { Coordinates, InputValue } from '../../types';
import { getNeighbours } from './getNeighbours';

export const generateBoardFromInput = (input: InputValue[], rowLength: number): string[] => {
    return input.map((e, i) => {
        if (e === InputValue.Mine) {
            return e;
        }

        const coordinates: Coordinates = {
            x: i % rowLength,
            y: Math.floor(i / rowLength),
        }

        const neighbours = getNeighbours(input, coordinates, rowLength);
        const nearbyMineCount = neighbours.filter((e) => e === InputValue.Mine).length;
        return `${nearbyMineCount}`;
    })
}