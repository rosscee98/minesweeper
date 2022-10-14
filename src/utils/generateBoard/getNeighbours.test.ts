import { InputValue } from '../../types';
import { getNeighbours } from './getNeighbours'

const setupFiveByFive = () => {
    const input = Array.from(Array(25).keys());
    const rowLength = 5;
    return { input, rowLength };
}

test('returns empty array when rowLength is negative', () => {
    const input = Array(4).fill(InputValue.Free)
    const rowLength = -1;

    expect(getNeighbours(input, { x: 0, y: 0 }, rowLength))
        .toEqual([]);
})

test('returns empty array when coordinate has negative value', () => {
    const input = Array(4).fill(InputValue.Free);
    const rowLength = 2;

    expect(getNeighbours(input, { x: -1, y: 0 }, rowLength))
        .toEqual([]);
    expect(getNeighbours(input, { x: 0, y: -1 }, rowLength))
        .toEqual([]);
})

test('returns empty array when input is empty array', () => {
    const input: InputValue[] = [];

    expect(getNeighbours(input, { x: 0, y: 0 }, 2))
        .toEqual([]);
})

test('2x2 input', () => {
    const input = Array(4).fill(InputValue.Free)
    const rowLength = 2;

    expect(getNeighbours(input, { x: 0, y: 0 }, rowLength))
        .toEqual(input);
})

test('3x3 input with center cell as focus', () => {
    const input = Array(9).fill(InputValue.Free);
    const rowLength = 3;

    expect(getNeighbours(input, { x: 1, y: 1 }, rowLength))
        .toEqual(input);
})

test('5x5 input with center cell as focus', () => {
    const { input, rowLength } = setupFiveByFive();

    expect(getNeighbours(input, { x: 2, y: 2 }, rowLength))
        .toEqual([6, 7, 8, 11, 12, 13, 16, 17, 18]);
})

test('5x5 input with top-left cell as focus', () => {
    const { input, rowLength } = setupFiveByFive();

    expect(getNeighbours(input, { x: 0, y: 0 }, rowLength))
        .toEqual([0, 1, 5, 6]);
})

test('5x5 input with bottom-left cell as focus', () => {
    const { input, rowLength } = setupFiveByFive();

    expect(getNeighbours(input, { x: 0, y: 4 }, rowLength))
        .toEqual([15, 16, 20, 21]);
})

test('5x5 input with top-right cell as focus', () => {
    const { input, rowLength } = setupFiveByFive();

    expect(getNeighbours(input, { x: 4, y: 0 }, rowLength))
        .toEqual([3, 4, 8, 9]);
})

test('5x5 input with bottom-right cell as focus', () => {
    const { input, rowLength } = setupFiveByFive();

    expect(getNeighbours(input, { x: 4, y: 4 }, rowLength))
        .toEqual([18, 19, 23, 24]);
})