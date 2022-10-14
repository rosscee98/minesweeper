import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { Mode } from './types';
import * as generateBoard from './utils/generateBoard/generateBoard';

const EASY_BOARD = [
    "2", "X", "2", "0", "0", "0", "0", "0",
    "3", "X", "3", "0", "0", "0", "0", "0",
    "3", "X", "3", "0", "0", "0", "0", "0",
    "3", "X", "3", "0", "0", "0", "0", "0",
    "2", "X", "2", "0", "0", "0", "0", "0",
    "1", "1", "1", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0",
]
const MEDIUM_BOARD = new Array(256).fill(0);
const HARD_BOARD = new Array(480).fill(0);

let NON_MINED_CELL_INDICES = [EASY_BOARD.indexOf("0")];
EASY_BOARD.forEach((entry, i) => ((entry === "1" || entry === "2" || entry === "3") && NON_MINED_CELL_INDICES.push(i)));

const setup = (mode: Mode = Mode.Easy) => {
    const board = {
        "easy": EASY_BOARD,
        "medium": MEDIUM_BOARD,
        "hard": HARD_BOARD,
    }[mode];
    (generateBoard.generateBoard as any) = () => board;
    const utils = render(<App />);
    const game = screen.getByTestId("game");
    const flagButton = screen.getByRole("button", { name: "Flag" })
    return {
        ...utils,
        game,
        flagButton,
    }
}

const setupWonGame = () => {
    const utils = setup();
    NON_MINED_CELL_INDICES.forEach((cellIndex) => {
        fireEvent.click(screen.getByTestId(`cell-${cellIndex}`));
    });
    return utils;
}

const setupLostGame = () => {
    const utils = setup();
    fireEvent.click(screen.getByTestId("cell-1"));
    return utils;
}

test('cell value hidden until clicked', () => {
    const { getByTestId } = setup();
    const cell = getByTestId("cell-0");

    expect(cell.textContent).toBe(" ");

    fireEvent.click(cell);

    expect(cell.textContent).toContain(EASY_BOARD[0]);
})

describe('modes', () => {
    test('game starts on easy', () => {
        const { getByText } = setup();

        expect(getByText("Mode: easy")).toBeInTheDocument();
        expect(getByText("Mines remaining: 10")).toBeInTheDocument();
    });

    test('can set to easy', () => {
        const { getByRole, getByText } = setup();
        const easyButton = getByRole("button", { name: "Easy" });
        const mediumButton = getByRole("button", { name: "Medium" });

        fireEvent.click(mediumButton);
        fireEvent.click(easyButton);

        expect(getByText("Mode: easy")).toBeInTheDocument();
        expect(getByText("Mines remaining: 10")).toBeInTheDocument();
    })

    test('can set to medium', () => {
        const { getByRole, getByText } = setup(Mode.Medium);
        const mediumButton = getByRole("button", { name: "Medium" });

        fireEvent.click(mediumButton);

        expect(getByText("Mode: medium")).toBeInTheDocument();
        expect(getByText("Mines remaining: 40")).toBeInTheDocument();
    })

    test('can set to hard', () => {
        const { getByRole, getByText } = setup(Mode.Hard);
        const hardButton = getByRole("button", { name: "Hard" });

        fireEvent.click(hardButton);

        expect(getByText("Mode: hard")).toBeInTheDocument();
        expect(getByText("Mines remaining: 99")).toBeInTheDocument();
    })

    test.each([
        ["renders 8x8 on easy", { mode: Mode.Easy, modeName: "Easy", rows: 8, columns: 8 }],
        ["renders 16x16 on medium", { mode: Mode.Medium, modeName: "Medium", rows: 16, columns: 16 }],
        ["renders 16x30 on hard", { mode: Mode.Hard, modeName: "Hard", rows: 30, columns: 16 }],
    ])(
        "%s",
        (_, { mode, modeName, rows, columns }) => {
            const { game, getByRole } = setup(mode);
            const modeButton = getByRole("button", { name: modeName });

            fireEvent.click(modeButton);

            expect(game.children.length).toBe(rows);
            expect(within(game).getAllByRole("button").length).toBe(rows * columns);
        }
    )
});

describe("clicking mined cell", () => {
    test('shows loss text', () => {
        const { getByTestId, getByText } = setup();
        const minedCell = getByTestId("cell-1");

        fireEvent.click(minedCell);

        expect(getByText("You lost!")).toBeInTheDocument();
    })

    test('cannot continue playing', () => {
        const { getByTestId, queryByText } = setup();
        const minedCell = getByTestId("cell-1");
        const nonMinedCell = getByTestId("cell-0");

        fireEvent.click(minedCell);
        fireEvent.click(nonMinedCell);

        expect(queryByText(EASY_BOARD[0])).not.toBeInTheDocument();
    });

    test('reveals all mines', () => {
        const { getByTestId, queryAllByText } = setup();
        const minedCell = getByTestId("cell-1");

        fireEvent.click(minedCell);

        expect(queryAllByText("X").length).toBe(5);
    });
});

describe('clicking blank cell', () => {
    test('shows no value', () => {
        const { getByTestId } = setup();
        const blankCell = getByTestId("cell-4");

        fireEvent.click(blankCell);

        expect(blankCell).not.toHaveTextContent("0");
    });

    test('reveals all connected non-mined cells', () => {
        const { getByTestId, queryAllByText } = setup();
        const blankCell = getByTestId("cell-4")

        fireEvent.click(blankCell);

        expect(queryAllByText("2").length).toBe(2);
        expect(queryAllByText("3").length).toBe(3);
    });
});

describe('winning game', () => {
    test('shows win text', () => {
        const { getByText } = setupWonGame();

        expect(getByText("You won!")).toBeInTheDocument();
    })

    test('reveals all mines', () => {
        const { queryAllByText, getByTestId } = setupWonGame();
        const minedCell = getByTestId("cell-1");

        fireEvent.click(minedCell);

        expect(queryAllByText('X').length).toBe(5);
    })

    test('mine counter is 0', () => {
        const { getByText } = setupWonGame();

        expect(getByText("Mines remaining: 0")).toBeInTheDocument();
    })
});

describe('clicking reset button', () => {
    test('resets game', () => {
        const { getByTestId } = setup();
        const cell = getByTestId("cell-0");
        const reset = getByTestId("reset");

        fireEvent.click(cell);
        expect(cell.textContent).toContain(EASY_BOARD[0]);

        fireEvent.click(reset);
        expect(cell.textContent).toBe(" ");
    });

    test('removes lost text', () => {
        const { getByTestId, queryByText } = setupLostGame();
        const reset = getByTestId("reset");

        fireEvent.click(reset);

        expect(queryByText("You lost!")).not.toBeInTheDocument();
    })

    test('removes won text', () => {
        const { getByTestId, queryByText } = setupWonGame();
        const reset = getByTestId("reset");

        fireEvent.click(reset);

        expect(queryByText("You won!")).not.toBeInTheDocument();
    })

    test('makes game playable again after loss', () => {
        const { getByTestId, getByText } = setupLostGame();
        const reset = getByTestId("reset");
        const nonMinedCell = getByTestId('cell-0');

        fireEvent.click(reset);
        fireEvent.click(nonMinedCell);

        expect(getByText("2")).toBeInTheDocument();
    })

    test('makes game playable again after win', () => {
        const { getByTestId, getByText } = setupWonGame();
        const reset = getByTestId("reset");
        const nonMinedCell = getByTestId("cell-0");

        fireEvent.click(reset);
        fireEvent.click(nonMinedCell);

        expect(getByText("2")).toBeInTheDocument();
    })

    test('sets flagging mode to off', () => {
        const { getByRole, queryByText, getByText } = setup();
        const flagButton = getByRole("button", { name: "Flag" });
        const resetButton = getByRole("button", { name: "Reset" });

        fireEvent.click(flagButton);
        fireEvent.click(resetButton);

        expect(queryByText("Flagging on")).not.toBeInTheDocument();
        expect(getByText("Flagging off")).toBeInTheDocument();
    });
})

describe('flagging', () => {
    test('clicking flag button toggles flagging label', () => {
        const { flagButton, queryByText, getByText } = setup();

        expect(flagButton).toBeInTheDocument();
        expect(getByText("Flagging off")).toBeInTheDocument();
        expect(queryByText("Flagging on")).not.toBeInTheDocument();

        fireEvent.click(flagButton);

        expect(queryByText("Flagging off")).not.toBeInTheDocument();
        expect(getByText("Flagging on")).toBeInTheDocument();

        fireEvent.click(flagButton);

        expect(getByText("Flagging off")).toBeInTheDocument();
        expect(queryByText("Flagging on")).not.toBeInTheDocument();
    });

    test('clicking cell creates flag without revealing cell value', () => {
        const { flagButton, getByTestId, getByText, queryByText } = setup();
        const cell = getByTestId("cell-0");

        fireEvent.click(flagButton);
        fireEvent.click(cell);

        expect(queryByText("2")).not.toBeInTheDocument();
        expect(getByText("F")).toBeInTheDocument();
    })

    test('clicking flag removes it', () => {
        const { flagButton, getByTestId, queryByText } = setup();
        const cell = getByTestId("cell-0");

        fireEvent.click(flagButton);
        fireEvent.click(cell);
        fireEvent.click(cell);

        expect(queryByText("F")).not.toBeInTheDocument();
    });

    test('cannot click flagged cell', () => {
        const { flagButton, getByTestId, queryAllByText } = setup();
        const minedCell = getByTestId("cell-1");

        fireEvent.click(flagButton);
        fireEvent.click(minedCell);
        fireEvent.click(flagButton);
        fireEvent.click(minedCell);

        expect(queryAllByText("X").length).toBe(0);
    });

    test('cannot flag clicked cell', () => {
        const { flagButton, getByTestId, queryByText } = setup();
        const cell = getByTestId("cell-0");

        fireEvent.click(cell);
        fireEvent.click(flagButton);
        fireEvent.click(cell);

        expect(queryByText("F")).not.toBeInTheDocument();
    });

    test('right click flags a cell', () => {
        const { getByTestId, getByText } = setup();
        const cell = getByTestId("cell-0");

        fireEvent.contextMenu(cell);

        expect(getByText("F")).toBeInTheDocument();
    })

    test('flagging decrements remaining mine counter', () => {
        const { getByTestId, getByText } = setup();
        const minedCell = getByTestId("cell-1");

        fireEvent.contextMenu(minedCell);

        expect(getByText("Mines remaining: 9")).toBeInTheDocument();
    })
})