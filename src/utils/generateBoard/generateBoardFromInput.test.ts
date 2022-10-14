import { InputValue } from '../../types';
import { generateBoardFromInput } from './generateBoardFromInput'

test('returns input in board form', () => {
    expect(generateBoardFromInput(Array(4).fill(InputValue.Free), 2))
        .toEqual(['0', '0', '0', '0']);

    expect(generateBoardFromInput([InputValue.Free, InputValue.Free, InputValue.Free, InputValue.Mine], 2))
        .toEqual(['1', '1', '1', 'X']);
})