import { InputValue } from '../../types';

export const generateRandomInput = (cellCount: number, mineCount: number): InputValue[] => {
    if (cellCount <= 0) {
        return [];
    }

    if (mineCount > cellCount) {
        mineCount = cellCount;
    }

    let mineIndices: number[] = [];
    while (mineIndices.length < mineCount) {
        const random = Math.floor(Math.random() * cellCount);
        if (!mineIndices.includes(random)) mineIndices.push(random);
    }

    const result = Array(cellCount).fill(InputValue.Free);
    mineIndices.forEach((i) => result[i] = InputValue.Mine);
    return result;
}