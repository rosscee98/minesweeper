import { Coordinates } from '../../types';

export const getNeighbours = <T>(input: T[], { x, y }: Coordinates, rowLength: number): T[] => {
    const neighbourCoordinates: Coordinates[] = [];

    if (x < 0 || y < 0) {
        return [];
    }

    [-1, 0, 1].forEach((yOffset) => {
        if ((y + yOffset) < 0 || (y + yOffset) >= (input.length / rowLength)) {
            return;
        }

        if (x > 0) {
            neighbourCoordinates.push({ x: x - 1, y: y + yOffset });
        }
        neighbourCoordinates.push({ x, y: y + yOffset });
        if (x < rowLength - 1) {
            neighbourCoordinates.push({ x: x + 1, y: y + yOffset });
        }
    })

    return neighbourCoordinates.map(({ x, y }) => {
        const i = x + (y * rowLength);
        return input[i];
    });
}