import { Mode } from '../../types';
import { getModeDetails } from '../getModeDetails';
import { generateRandomInput } from './generateRandomInput';

export const generateBoard = (mode: Mode = Mode.Easy) => {
    const { rowCount, rowLength, mineCount } = getModeDetails(mode);
    const input = generateRandomInput(rowCount * rowLength, mineCount);
    return generateBoardFromInput(input, rowCount, rowLength);
}