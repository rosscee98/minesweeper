export type Cell = {
    id: number,
    value: string,
    isClicked: boolean,
    isFlagged: boolean,
};

export enum Mode {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export enum InputValue {
    Mine = "X",
    Free = "-",
}