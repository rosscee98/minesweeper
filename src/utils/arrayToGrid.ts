export const arrayToGrid = <T>(array: T[], rowLength: number): T[][] => {
    const result = [];
    for (let i = 0; i < array.length; i += rowLength) {
        result.push(array.slice(i, i + rowLength));
    }
    return result;
}