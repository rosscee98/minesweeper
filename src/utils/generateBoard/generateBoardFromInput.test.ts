import { InputValue } from '../../types';
import { generateBoardFromInput } from './generateBoardFromInput'

const givenTestCase = {
    input: [
        "-", "-", "-", "-", "-",
        "-", "-", "-", "-", "-",
        "X", "X", "-", "-", "-",
        "-", "-", "-", "-", "-",
        "-", "-", "-", "-", "X",
    ],
    rowLength: 5,
    output: [
        "0", "0", "0", "0", "0",
        "2", "2", "1", "0", "0",
        "X", "X", "1", "0", "0",
        "2", "2", "1", "1", "1",
        "0", "0", "0", "1", "X",
    ]
}

test.each([
    ['board with no mines returns array of zeros', { input: Array(4).fill(InputValue.Free), rowLength: 2, output: ['0', '0', '0', '0'] }],
    ['2x2 board with 1 mine', { input: [...Array(3).fill(InputValue.Free), InputValue.Mine], rowLength: 2, output: ['1', '1', '1', 'X'] }],
    ['5x5 board with 3 mines', givenTestCase],
])(
    "%s",
    (_, { input, rowLength, output }) => {
        expect(generateBoardFromInput(input, rowLength)).toEqual(output);
    }
)