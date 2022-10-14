import { InputValue } from '../../types';
import { generateRandomInput } from './generateRandomInput';

test("returns empty array given cellCount of 0", () => {
    expect(generateRandomInput(0, 0)).toEqual([]);
    expect(generateRandomInput(0, 1)).toEqual([]);
})

test("returns empty array given negative cellCount", () => {
    expect(generateRandomInput(-1, 0)).toEqual([]);
    expect(generateRandomInput(-1, 1)).toEqual([]);
})

test("returns array with no mines given negative mineCount", () => {
    expect(generateRandomInput(1, -1)).toEqual(Array(1).fill(InputValue.Free));
    expect(generateRandomInput(3, -1)).toEqual(Array(3).fill(InputValue.Free));
})

test("returns array with cellCount mines when mineCount exceeds cellCount", () => {
    expect(generateRandomInput(5, 7)).toEqual(Array(5).fill(InputValue.Mine));
})

test.each([
    ["returns 1 cell with 0 mines", { cellCount: 1, mineCount: 0 }],
    ["returns 1 cell with 1 mine", { cellCount: 1, mineCount: 1 }],
    ["returns 3 cells with 1 mine", { cellCount: 3, mineCount: 1 }],
    ["returns 5 cells with 2 mines", { cellCount: 5, mineCount: 2 }],
])(
    "%s",
    (_, { cellCount, mineCount }) => {
        const result = generateRandomInput(cellCount, mineCount);
        expect(result.filter((entry) => entry === InputValue.Free).length).toBe(cellCount - mineCount);
        expect(result.filter((entry) => entry === InputValue.Mine).length).toBe(mineCount);
    }
)