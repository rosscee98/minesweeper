import { Mode } from '../types';

export const getModeDetails = (mode: Mode = Mode.Easy) => {
    return {
        'easy': {
            rowCount: 8,
            rowLength: 8,
            mineCount: 10,
        },
        'medium': {
            rowCount: 16,
            rowLength: 16,
            mineCount: 40,
        },
        'hard': {
            rowCount: 30,
            rowLength: 16,
            mineCount: 99,
        }
    }[mode];
}