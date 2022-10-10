import { Cell } from '../types';

export const getCellIds = (cells: Cell[]): number[] => {
    return cells.map((cell) => cell.id);
}